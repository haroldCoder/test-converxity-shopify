import { ShopifyBillingGateway } from "@/common/infrastructure/gateways/shopify-billing.gateway";
import { PrismaBillingRepository } from "@/common/infrastructure/repositories/prisma-billing.repository";
import { PrismaShopRepository } from "@/modules/shop/infrastructure/repositories";
import { ShopNotFoundException } from "@/modules/shop/domain/exceptions";

export class CreateUsageChargeUseCase {
  constructor(
    private readonly gateway: ShopifyBillingGateway,
    private readonly repo = new PrismaBillingRepository(),
    private readonly shopRepo = new PrismaShopRepository()
  ) { }

  async execute(input: {
    shopDomain: string;
    subscriptionLineItemId: string;
    conversionId: string;
    amount: number;
    description: string;
  }) {
    // Check if shop exists
    const shop = await this.shopRepo.findByDomain(
      input.shopDomain
    );
    if (!shop) {
      throw new ShopNotFoundException(input.shopDomain);
    }

    console.log(
      `Creating usage charge for shop ${input.shopDomain}, subscription item ${input.subscriptionLineItemId}: ${input.amount}`
    );

    await this.gateway.createUsageCharge(
      input.subscriptionLineItemId,
      input.amount,
      input.description
    );
    // Errors (including userErrors) are thrown by ShopifyBillingGateway

    const record = await this.repo.create({
      conversionId: input.conversionId,
      amount: input.amount,
    });

    return record.id;
  }
}