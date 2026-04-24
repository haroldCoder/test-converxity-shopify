import { PrismaAffiliateRepository } from "@/common/infrastructure/repositories";

export class GetAffiliatesUseCase {
  constructor(
    private repo =
      new PrismaAffiliateRepository()
  ) {}

  execute(shopId: string) {
    return this.repo.findAll(shopId);
  }
}