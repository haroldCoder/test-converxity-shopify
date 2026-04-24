import type { BillingGateway } from "../../domain/gateways";
import type { AffiliateRepository, ConversionRepository } from "../../domain/repositories";
import { calculatePercent } from "../../shared/utils";

export class RegisterConversionUseCase {
  constructor(
    private readonly conversionRepo: ConversionRepository,
    private readonly affiliateRepo: AffiliateRepository,
    private readonly billingGateway: BillingGateway
  ) {}

  async execute(data: {
    shopId: string;
    shop: string;
    affiliateCode: string;
    orderId: string;
    total: number;
  }) {
    const exists = await this.conversionRepo.findByOrderId(data.orderId);

    if (exists) return exists;

    const affiliate = await this.affiliateRepo.findByCode(
      data.shopId,
      data.affiliateCode
    );

    if (!affiliate) {
      throw new Error("Affiliate not found");
    }

    const appFee = calculatePercent(data.total, 5);
    const affiliateFee = calculatePercent(
      data.total,
      affiliate.commissionPercent
    );

    const conversion = await this.conversionRepo.create({
      id: crypto.randomUUID(),
      createdAt: new Date(),
      shopId: data.shopId,
      affiliateId: affiliate.id,
      orderId: data.orderId,
      total: data.total,
      appFee,
      affiliateFee,
    });

    await this.billingGateway.createUsageCharge({
      shop: data.shop,
      amount: appFee,
      description: `Commission for order ${data.orderId}`,
    });

    return conversion;
  }
}