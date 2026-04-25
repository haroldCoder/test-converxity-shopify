import { PrismaTrackingRepository } from "../../infrastructure/repositories";
import { PrismaShopRepository } from "../../../../modules/shop/infrastructure/repositories";
import { CreateUsageChargeUseCase } from "../../../../modules/billing/application/use-cases";
import {
  ShopifyBillingGateway,
  ShopifyGraphqlClient,
} from "../../../../common/infrastructure/gateways";
import { ShopifyRateLimitException } from "../../../../common/domain/exceptions";
import { ShopNotFoundException } from "@/modules/shop/domain/exceptions";
import { AffiliateNotFoundException } from "@/modules/affiliates/domain/exceptions";

export class RegisterConversionUseCase {
  constructor(
    private readonly repo = new PrismaTrackingRepository(),
    private readonly shopRepo = new PrismaShopRepository()
  ) { }

  async execute(input: {
    shopId: string;
    affiliateCode: string;
    orderId: string;
    total: number;
  }) {
    // Check if shop exists
    const shop = await this.shopRepo.findByDomain(
      input.shopId
    );
    if (!shop) {
      throw new ShopNotFoundException(input.shopId);
    }

    const exists = await this.repo.findByOrderId(
      shop.id,
      input.orderId
    );

    if (exists) {
      return exists;
    }

    const affiliate = await this.repo.findAffiliateByCode(
      shop.id,
      input.affiliateCode
    );

    if (!affiliate) {
      throw new AffiliateNotFoundException(
        input.affiliateCode
      );
    }

    const appFee = input.total * 0.05;
    const affiliateFee =
      input.total * (affiliate.commissionPercent / 100);

    const conversion = await this.repo.createConversion({
      shopId: shop.id,
      affiliateId: affiliate.id,
      orderId: input.orderId,
      total: input.total,
      appFee,
      affiliateFee,
    });

    if (shop.accessToken && shop.subscriptionLineItemId) {
      await this.chargeUsage(
        shop as { domain: string; accessToken: string; subscriptionLineItemId: string },
        conversion.id,
        input.orderId,
        appFee,
      );
    } else {
      console.warn(
        `[Billing] Skipped usage charge for ${input.shopId}: missing subscription data or token.`
      );
    }

    return conversion;
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private async chargeUsage(
    shop: { domain: string; accessToken: string; subscriptionLineItemId: string },
    conversionId: string,
    orderId: string,
    appFee: number
  ): Promise<void> {
    try {
      const graphqlClient = new ShopifyGraphqlClient(
        shop.domain,
        shop.accessToken,
        // Configuración de reintentos: hasta 3 reintentos, comenzando con un back-off de 500 ms
        { maxRetries: 3, baseDelayMs: 500 }
      );
      const billingGateway = new ShopifyBillingGateway(
        graphqlClient
      );
      const billingUseCase =
        new CreateUsageChargeUseCase(billingGateway);

      await billingUseCase.execute({
        shopDomain: shop.domain,
        subscriptionLineItemId: shop.subscriptionLineItemId,
        conversionId,
        amount: appFee,
        description: `Comisión 5% venta referida (Orden: ${orderId})`,
      });

      console.log(
        `[Billing] Usage charge of $${appFee} created for shop ${shop.domain}`
      );
    } catch (error) {
      if (error instanceof ShopifyRateLimitException) {
        // todos: implementar un sistema de reintentos con backoff exponencial.
        console.error(
          `[Billing] Rate limit exceeded for shop ${shop.domain} ` +
          `after all retries. Suggested retry-after: ${error.retryAfterMs}ms. ` +
          `Conversion ${conversionId} will need manual billing reconciliation.`,
          error,
        );
      } else {
        // General billing error — continuar para no deshacer la conversión.
        console.error(
          `[Billing] Failed to create usage charge for shop ${shop.domain}:`,
          error,
        );
      }
    }
  }
}