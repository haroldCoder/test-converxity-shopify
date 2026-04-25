import type { DashboardMetrics } from '../entities'

export interface DashboardRepository {
    getMetrics(shopId: string): Promise<DashboardMetrics>
}
