import { Injectable } from "@nestjs/common";
import { PrismaAffiliateRepository } from "@/common/infrastructure/repositories";
import { AffiliateEntity } from "@/common/domain/entites";
import { PrismaShopRepository } from "@/modules/shop/infrastructure/repositories";
import { ShopNotFoundException } from "@/modules/shop/domain/exceptions";

@Injectable()
export class GetAffiliatesUseCase {
  constructor(
    private readonly repo: PrismaAffiliateRepository,
    private readonly shopRepo: PrismaShopRepository
  ) { }

  async execute(shopId: string): Promise<AffiliateEntity[]> {
    // Verificar si la tienda existe
    const shop = await this.shopRepo.findById(shopId);
    if (!shop) {
      throw new ShopNotFoundException(shopId);
    }

    const affiliates = await this.repo.findAll(shopId);
    return affiliates;
  }
}