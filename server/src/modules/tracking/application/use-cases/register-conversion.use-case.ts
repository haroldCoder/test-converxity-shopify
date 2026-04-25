import { PrismaTrackingRepository } from "../../infrastructure/repositories";
import { PrismaShopRepository } from "../../../../modules/shop/infrastructure/repositories";
import { CreateUsageChargeUseCase } from "../../../../modules/billing/application/use-cases";
import { ShopifyBillingGateway, ShopifyGraphqlClient } from "../../../../common/infrastructure/gateways";

export class RegisterConversionUseCase {
  constructor(
    private repo = new PrismaTrackingRepository(),
    private shopRepo = new PrismaShopRepository()
  ) { }

  async execute(input: {
    shopId: string;
    affiliateCode: string;
    orderId: string;
    total: number;
  }) {
    const exists = await this.repo.findByOrderId(
      input.shopId,
      input.orderId
    );

    if (exists) {
      return {
        message: "Conversion already processed",
      };
    }

    const affiliate = await this.repo.findAffiliateByCode(
      input.shopId,
      input.affiliateCode
    );

    if (!affiliate) {
      throw new Error("Affiliate not found");
    }

    const appFee = input.total * 0.05;
    const affiliateFee = input.total * (affiliate.commissionPercent / 100);

    const conversion = await this.repo.createConversion({
      shopId: input.shopId,
      affiliateId: affiliate.id,
      orderId: input.orderId,
      total: input.total,
      appFee,
      affiliateFee,
    });

    // --- Billing Integration ---
    try {
      const shop = await this.shopRepo.findByDomain(input.shopId);

      if (shop && shop.accessToken && shop.subscriptionLineItemId) {
        const graphqlClient = new ShopifyGraphqlClient(shop.domain, shop.accessToken);
        const billingGateway = new ShopifyBillingGateway(graphqlClient);
        const billingUseCase = new CreateUsageChargeUseCase(billingGateway);

        await billingUseCase.execute({
          subscriptionLineItemId: shop.subscriptionLineItemId,
          conversionId: conversion.id,
          amount: appFee,
          description: `Comisión 5% venta referida (Orden: ${input.orderId})`,
        });

        console.log(`Usage charge of $${appFee} created for shop ${shop.domain}`);
      } else {
        console.warn(`Could not create usage charge for shop ${input.shopId}: Missing subscription data or token.`);
      }
    } catch (error) {
      console.error('Error creating usage charge during conversion registration:', error);
      // We don't throw here to avoid failing the conversion registration if billing fails
    }

    return conversion;
  }
}