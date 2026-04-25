import type { Affiliate } from '../entities'

export interface AffiliateRepository {
    getAffiliates(shopId: string): Promise<Affiliate[]>
    createAffiliate(affiliate: Omit<Affiliate, 'id'>): Promise<Affiliate>
    deleteAffiliate(id: string): Promise<void>
}
