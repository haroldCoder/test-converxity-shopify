import { PrismaAffiliateRepository } from "@/common/infrastructure/repositories";
import { AffiliateEntity } from "@/common/domain/entites";

export class GetAffiliatesUseCase {
  constructor(
    private repo = new PrismaAffiliateRepository()
  ) { }

  async execute(shopId: string): Promise<AffiliateEntity[]> {
    const affiliates = await this.repo.findAll(shopId);
    return affiliates;
  }
}