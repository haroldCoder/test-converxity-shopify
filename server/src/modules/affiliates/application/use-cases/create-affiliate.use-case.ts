import { Injectable } from "@nestjs/common";
import { PrismaAffiliateRepository } from "@/common/infrastructure/repositories";
import { AffiliateAlreadyExistsException } from "../../domain/exceptions/affiliate-already-exists.exception";
import { ShopNotFoundException } from "@/modules/shop/domain/exceptions";
import { PrismaShopRepository } from "@/modules/shop/infrastructure/repositories";

@Injectable()
export class CreateAffiliateUseCase {
  constructor(
    private readonly repo: PrismaAffiliateRepository,
    private readonly shopRepo: PrismaShopRepository
  ) { }


  async execute(input: {
    shopId: string;
    name: string;
    code: string;
    commissionPercent: number;
  }): Promise<string> {
    const existing = await this.repo.findByCode(
      input.shopId,
      input.code
    );

    if (existing) {
      throw new AffiliateAlreadyExistsException(
        input.code
      );
    }

    // Verificar si la tienda existe
    const shop = await this.shopRepo.findById(input.shopId);

    if (!shop) {
      throw new ShopNotFoundException(input.shopId);
    }

    const affiliate = await this.repo.create(input);

    return affiliate.id;
  }

}