import { Injectable } from "@nestjs/common";
import { prisma } from "@/common/infrastructure/database/prisma";

@Injectable()
export class PrismaTrackingRepository {
  async findByOrderId(
    shopId: string,
    orderId: string
  ) {
    return prisma.conversion.findFirst({
      where: {
        shopId,
        orderId,
      },
    });
  }

  async findAffiliateByCode(
    shopId: string,
    code: string
  ) {
    return prisma.affiliate.findFirst({
      where: {
        shopId,
        code,
      },
    });
  }

  async createConversion(
    data: {
      shopId: string;
      affiliateId: string;
      orderId: string;
      total: number;
      currency: string;
      appFee: number;
      affiliateFee: number;
    }

  ) {
    return prisma.conversion.create({
      data,
    });
  }
}