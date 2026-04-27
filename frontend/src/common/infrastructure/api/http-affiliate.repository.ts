import { http } from '../../services/http.service'
import type { Affiliate } from '../../domain/entities'
import type { AffiliateRepository } from '../../domain/repositories'
import type { ApiResponseAffiliatesEntity } from '../entities/api-response-affiliates.entity'
import { ConvertApiAffiliatesToAffiliatesMapper } from '../mappers/convert-api-affiliates-to-affiliates.mapper'

export class HttpAffiliateRepository implements AffiliateRepository {
    async getAffiliates(shopId: string): Promise<Affiliate[]> {
        const apiAffiliates = await http<ApiResponseAffiliatesEntity[]>(`/api/affiliates?shopId=${shopId}`)
        return ConvertApiAffiliatesToAffiliatesMapper.map(apiAffiliates)
    }

    async createAffiliate(affiliate: Omit<Affiliate, 'id'>): Promise<Affiliate> {
        return http<Affiliate>('/api/affiliates', {
            method: 'POST',
            body: JSON.stringify(affiliate),
        })
    }

    async deleteAffiliate(id: string): Promise<void> {
        return http(`/api/affiliates/${id}`, {
            method: 'DELETE',
        })
    }
}
