import { ShopifyBillingGateway } from "@/common/infrastructure/gateways/shopify-billing.gateway";
import { PrismaBillingRepository } from "@/common/infrastructure/repositories/prisma-billing.repository";

export class CreateUsageChargeUseCase {
  constructor(
    private readonly gateway: ShopifyBillingGateway,
    private repo = new PrismaBillingRepository()
  ) { }

  async execute(input: {
    subscriptionLineItemId: string;
    conversionId: string;
    amount: number;
    description: string;
  }) {
    console.log(`Creating usage charge for subscription item ${input.subscriptionLineItemId}: ${input.amount}`);

    const response = await this.gateway.createUsageCharge(
      input.subscriptionLineItemId,
      input.amount,
      input.description
    );

    if (response.appUsageRecordCreate?.userErrors?.length > 0) {
      throw new Error(`Shopify Billing Error: ${response.appUsageRecordCreate.userErrors[0].message}`);
    }

    await this.repo.create({
      conversionId: input.conversionId,
      amount: input.amount,
    });

    return response;
  }
}