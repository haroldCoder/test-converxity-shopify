import { Injectable } from "@nestjs/common";
import { ShopifyBillingGateway } from "@/common/infrastructure/gateways/shopify-billing.gateway";
import { PrismaBillingRepository } from "@/common/infrastructure/repositories/prisma-billing.repository";
import { PrismaShopRepository } from "@/modules/shop/infrastructure/repositories";
import { ShopNotFoundException } from "@/modules/shop/domain/exceptions";

@Injectable()
export class CreateUsageChargeUseCase {
  constructor(
    private readonly repo: PrismaBillingRepository,
    private readonly shopRepo: PrismaShopRepository
  ) { }

  async execute(input: {
    shopDomain: string;
    subscriptionLineItemId: string;
    conversionId: string;
    amount: number;
    description: string;
    gateway: ShopifyBillingGateway; // Pasar gateway dinámicamente o inyectarlo
  }) {
    // Verificar si la tienda existe
    const shop = await this.shopRepo.findByDomain(
      input.shopDomain
    );
    if (!shop) {
      throw new ShopNotFoundException(input.shopDomain);
    }

    console.log(
      `Creating usage charge for shop ${input.shopDomain}, subscription item ${input.subscriptionLineItemId}: ${input.amount}`
    );

    await input.gateway.createUsageCharge(
      input.subscriptionLineItemId,
      input.amount,
      input.description
    );
    // Los errores (incluyendo userErrors) son lanzados por ShopifyBillingGateway

    const record = await this.repo.create({
      conversionId: input.conversionId,
      amount: input.amount,
    });

    return record.id;
  }
}