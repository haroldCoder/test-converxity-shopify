import { Injectable, Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { Cache } from "cache-manager";
import { prisma } from "@/common/infrastructure/database/prisma/client";

@Injectable()
export class PrismaShopRepository {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

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
    const cacheKey = `shop:${domain}`;
    const cachedShop = await this.cacheManager.get(cacheKey);
    if (cachedShop) {
      return cachedShop as any;
    }

    const shop = await prisma.shop.findUnique({
      where: { domain },
    });

    if (shop) {
      await this.cacheManager.set(cacheKey, shop, 600000); // asignar la data en cache por 10 minutos
    }

    return shop;
  }


  async findById(id: string) {
    return prisma.shop.findUnique({
      where: { id },
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