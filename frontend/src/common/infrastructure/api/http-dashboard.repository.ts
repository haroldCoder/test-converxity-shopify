import { http } from '../../services/http.service'
import type { DashboardMetrics } from '../../domain/entities'
import type { DashboardRepository } from '../../domain/repositories'
import { ConvertApiDashboardToDashboarMetricMapper } from '../mappers'
import type { ApiResponseDashboardEntity } from '../entities'

export class HttpDashboardRepository implements DashboardRepository {
    async getMetrics(shopId: string): Promise<DashboardMetrics> {
        const apiResponseDashboardEntity = await http<ApiResponseDashboardEntity>(`/api/dashboard?shopId=${shopId}`)
        return ConvertApiDashboardToDashboarMetricMapper.map(apiResponseDashboardEntity)
    }
}
