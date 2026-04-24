export class GetDashboardMetricsUseCase {
  execute(conversions: any[]) {
    return {
      totalSales: conversions.reduce((a, b) => a + b.total, 0),
      totalAppFees: conversions.reduce((a, b) => a + b.appFee, 0),
      totalAffiliateFees: conversions.reduce(
        (a, b) => a + b.affiliateFee,
        0
      ),
    };
  }
}