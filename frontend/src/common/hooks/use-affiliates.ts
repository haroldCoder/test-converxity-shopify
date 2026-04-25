import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DiFactory } from '../di/di-factory'

const affiliateService = DiFactory.getAffiliateRepo()

export type { Affiliate } from '../domain/entities'

export function useAffiliates(shopId: string) {
  return useQuery({
    queryKey: ['affiliates', shopId],
    queryFn: () => affiliateService.getAffiliates(shopId),
    enabled: !!shopId,
  })
}

export function useCreateAffiliate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { shopId: string; name: string; code: string; commissionPercent: number }) =>
      affiliateService.createAffiliate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliates'] })
    },
  })
}

export function useDeleteAffiliate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => affiliateService.deleteAffiliate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliates'] })
    },
  })
}