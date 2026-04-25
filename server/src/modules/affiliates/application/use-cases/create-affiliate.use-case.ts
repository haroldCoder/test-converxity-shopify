import { PrismaAffiliateRepository } from "@/common/infrastructure/repositories";
import { AffiliateAlreadyExistsException } from "../../domain/exceptions/affiliate-already-exists.exception";
import { ShopNotFoundException } from "../../domain/exceptions/shop-not-found.exception";
import { PrismaShopRepository } from "@/modules/shop/infrastructure/repositories";


export class CreateAffiliateUseCase {
  constructor(
    private repo = new PrismaAffiliateRepository(),
    private shopRepo = new PrismaShopRepository()

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

    // Check if shop exists
    const shop = await this.shopRepo.findById(input.shopId);

    if (!shop) {
      throw new ShopNotFoundException(input.shopId);
    }

    const affiliate = await this.repo.create(input);

    return affiliate.id;
  }

}