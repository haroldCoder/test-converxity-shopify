import { prisma } from "../database/prisma/client";

export class PrismaAffiliateRepository {
  async create(data: {
    shopId: string;
    name: string;
    code: string;
    commissionPercent: number;
  }) {
    return prisma.affiliate.create({
      data,
    });
  }

  async findAll(shopId: string) {
    return prisma.affiliate.findMany({
      where: { shopId },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string) {
    return prisma.affiliate.findUnique({
      where: { id },
    });
  }

  async findByCode(
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

  async update(
    id: string,
    data: Partial<{
      name: string;
      code: string;
      commissionPercent: number;
      isActive: boolean;
    }>
  ) {
    return prisma.affiliate.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.affiliate.delete({
      where: { id },
    });
  }
}