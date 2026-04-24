import type { AffiliateEntity } from "../entites";

export interface AffiliateRepository {
  create(data: AffiliateEntity): Promise<AffiliateEntity>;
  findByCode(shopId: string, code: string): Promise<AffiliateEntity | null>;
  findAll(shopId: string): Promise<AffiliateEntity[]>;
}