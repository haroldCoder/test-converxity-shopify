import type { AffiliateRepository } from "../domain/repositories";
import { HttpAffiliateRepository, HttpDashboardRepository } from "../infrastructure/api";
import type { DashboardRepository } from "../domain/repositories";

export class DiFactory {
    static getAffiliateRepo(): AffiliateRepository {
        return new HttpAffiliateRepository()
    }

    static getDashboardRepo(): DashboardRepository {
        return new HttpDashboardRepository()
    }
}