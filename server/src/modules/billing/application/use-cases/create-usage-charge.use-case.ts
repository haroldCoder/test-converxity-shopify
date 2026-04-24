import { ShopifyBillingGateway } from "@/common/infrastructure/gateways";
import { PrismaBillingRepository } from "@/common/infrastructure/repositories/prisma-billing.repository";

export class CreateUsageChargeUseCase {
  constructor(
    private readonly gateway: ShopifyBillingGateway,
    private repo =
      new PrismaBillingRepository()
  ) {}

  async execute(input: {
    shopDomain: string;
    conversionId: string;
    amount: number;
    description: string;
  }) {
    const response =
      await this.gateway.createUsageCharge(
        input.shopDomain,
        input.amount,
        input.description
      );

    await this.repo.create({
      conversionId: input.conversionId,
      amount: input.amount,
    });

    return response;
  }
}