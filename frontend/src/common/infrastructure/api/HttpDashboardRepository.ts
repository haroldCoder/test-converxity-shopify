import { http } from '../../services/http.service'
import type { DashboardMetrics } from '../../domain/entities'
import type { DashboardRepository } from '../../domain/repositories'

export class HttpDashboardRepository implements DashboardRepository {
    async getMetrics(shopId: string): Promise<DashboardMetrics> {
        return http<DashboardMetrics>(`/api/dashboard?shopId=${shopId}`)
    }
}
