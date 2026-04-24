export interface ConvertionEntity {
  id: string;
  shopId: string;
  affiliateId: string;
  orderId: string;
  total: number;
  appFee: number;
  affiliateFee: number;
  createdAt: Date;
}