import { useQuery } from '@tanstack/react-query'
import { DiFactory } from '../di/di-factory'

const dashboardService = DiFactory.getDashboardRepo()

export function useDashboardMetrics(shopId: string) {
  return useQuery({
    queryKey: ['dashboard', shopId],
    queryFn: () => dashboardService.getMetrics(shopId),
    enabled: !!shopId,
  })
}