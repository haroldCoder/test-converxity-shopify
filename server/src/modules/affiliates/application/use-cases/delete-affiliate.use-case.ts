import { Injectable } from "@nestjs/common";
import { PrismaAffiliateRepository } from "@/common/infrastructure/repositories";
import { AffiliateNotFoundException } from "../../domain/exceptions/affiliate-not-found.exception";
import { AffiliateEntity } from "@/common/domain/entites";

@Injectable()
export class DeleteAffiliateUseCase {
  constructor(
    private readonly repo: PrismaAffiliateRepository
  ) { }

  async execute(id: string): Promise<AffiliateEntity> {
    const affiliate = await this.repo.findById(id);

    if (!affiliate) {
      throw new AffiliateNotFoundException(id);
    }

    const deleted = await this.repo.delete(id);
    return deleted;
  }
}