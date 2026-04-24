import { prisma } from "@/common/infrastructure/database/prisma/client";

export class PrismaShopRepository {
  async upsert(data: {
    domain: string;
    accessToken: string;
  }) {
    return prisma.shop.upsert({
      where: {
        domain: data.domain,
      },
      update: {
        accessToken:
          data.accessToken,
      },
      create: data,
    });
  }

  async findByDomain(
    domain: string
  ) {
    return prisma.shop.findUnique({
      where: { domain },
    });
  }

  async updateSubscription(
    domain: string,
    subscriptionId: string,
    subscriptionLineItemId: string
  ) {
    return prisma.shop.update({
      where: { domain },
      data: {
        subscriptionId,
        subscriptionLineItemId,
      },
    });
  }
}