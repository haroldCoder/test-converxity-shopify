import type { DashboardMetrics } from "../../domain/entities";
import type { ApiResponseDashboardEntity } from "../entities/api-response-dashboard.entity";

export class ConvertApiDashboardToDashboarMetricMapper {
    static map(apiResponseDashboardEntity: ApiResponseDashboardEntity): DashboardMetrics {
        return {
            totalReferredSales: apiResponseDashboardEntity.totalSales,
            totalCommissionsGenerated: apiResponseDashboardEntity.totalAffiliateFees,
            commissionsToPayAffiliates: apiResponseDashboardEntity.totalAppFees,
        }
    }
}