import { PrismaAffiliateRepository } from "@/common/infrastructure/repositories";
import { AffiliateConvertionEntity } from "@/common/domain/entites";

export class GetAffiliatesUseCase {
  constructor(
    private repo = new PrismaAffiliateRepository()
  ) { }

  async execute(shopId: string): Promise<AffiliateConvertionEntity[]> {
    const affiliates = await this.repo.findAll(shopId);
    return affiliates;
  }
}