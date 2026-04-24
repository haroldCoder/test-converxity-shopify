import { PrismaTrackingRepository } from "../../infrastructure/repositories";

export class RegisterConversionUseCase {
  constructor(
    private repo =
      new PrismaTrackingRepository()
  ) {}

  async execute(input: {
    shopId: string;
    affiliateCode: string;
    orderId: string;
    total: number;
  }) {
    const exists =
      await this.repo.findByOrderId(
        input.shopId,
        input.orderId
      );

    if (exists) {
      return {
        message:
          "Conversion already processed",
      };
    }

    const affiliate =
      await this.repo.findAffiliateByCode(
        input.shopId,
        input.affiliateCode
      );

    if (!affiliate) {
      throw new Error(
        "Affiliate not found"
      );
    }

    const appFee =
      input.total * 0.05;

    const affiliateFee =
      input.total *
      (affiliate.commissionPercent /
        100);

    return this.repo.createConversion(
      {
        shopId: input.shopId,
        affiliateId: affiliate.id,
        orderId: input.orderId,
        total: input.total,
        appFee,
        affiliateFee,
      }
    );
  }
}