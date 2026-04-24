export interface BillingGateway {
  createUsageCharge(params: {
    shop: string;
    amount: number;
    description: string;
  }): Promise<void>;
}