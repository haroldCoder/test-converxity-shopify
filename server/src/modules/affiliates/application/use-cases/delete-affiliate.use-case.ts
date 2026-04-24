import { PrismaAffiliateRepository } from "@/common/infrastructure/repositories";

export class DeleteAffiliateUseCase {
  constructor(
    private repo =
      new PrismaAffiliateRepository()
  ) {}

  execute(id: string) {
    return this.repo.delete(id);
  }
}