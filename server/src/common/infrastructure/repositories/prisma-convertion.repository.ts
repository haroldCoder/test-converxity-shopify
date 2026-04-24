import { prisma } from "../database/prisma/client";

export class PrismaConvertionRepository {
  async create(data: {
    shopId: string;
    affiliateId: string;
    orderId: string;
    total: number;
    appFee: number;
    affiliateFee: number;
    currency?: string;
  }) {
    return prisma.conversion.create({
      data: {
        currency: "USD",
        ...data,
      },
    });
  }

  async findById(id: string) {
    return prisma.conversion.findUnique({
      where: { id },
    });
  }

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

  async findAll(shopId: string) {
    return prisma.conversion.findMany({
      where: { shopId },
      include: {
        affiliate: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async updateStatus(
    id: string,
    status: string
  ) {
    return prisma.conversion.update({
      where: { id },
      data: { status },
    });
  }
}