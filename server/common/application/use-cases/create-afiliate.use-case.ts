
import crypto from "crypto";
import type { AffiliateRepository } from "../../domain/repositories";
import type { AffiliateEntity } from "../../domain/entites";

export class CreateAffiliateUseCase {
  constructor(
    private readonly repository: AffiliateRepository
  ) {}

  async execute(data: {
    shopId: string;
    name: string;
    code: string;
    commissionPercent: number;
  }): Promise<AffiliateEntity> {
    return this.repository.create({
      id: crypto.randomUUID(),
      createdAt: new Date(),
      ...data,
    });
  }
}