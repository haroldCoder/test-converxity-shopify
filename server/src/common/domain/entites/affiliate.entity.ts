export interface AffiliateEntity {
  id: string;
  shopId: string;
  name: string;
  code: string;
  commissionPercent: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}