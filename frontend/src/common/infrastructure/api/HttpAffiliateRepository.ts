import { http } from '../../services/http.service'
import type { Affiliate } from '../../domain/entities'
import type { AffiliateRepository } from '../../domain/repositories'

export class HttpAffiliateRepository implements AffiliateRepository {
    async getAffiliates(shopId: string): Promise<Affiliate[]> {
        return http<Affiliate[]>(`/api/affiliates?shopId=${shopId}`)
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
