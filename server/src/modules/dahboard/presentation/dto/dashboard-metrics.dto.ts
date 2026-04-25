export class DashboardMetricsDto {
    totalSales: number;
    totalAppFees: number;
    totalAffiliateFees: number;
    totalConversions: number;

    constructor(partial: Partial<DashboardMetricsDto>) {
        Object.assign(this, partial);
    }
}
