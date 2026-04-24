import { PrismaAffiliateRepository } from "@/common/infrastructure/repositories";

export class CreateAffiliateUseCase {
  constructor(
    private repo =
      new PrismaAffiliateRepository()
  ) {}

  execute(input: {
    shopId: string;
    name: string;
    code: string;
    commissionPercent: number;
  }) {
    return this.repo.create(input);
  }
}