import type { AffiliateRepository } from "../domain/repositories";
import { HttpAffiliateRepository } from "../infrastructure/api/HttpAffiliateRepository";
import type { DashboardRepository } from "../domain/repositories";
import { HttpDashboardRepository } from "../infrastructure/api/HttpDashboardRepository";

export class DiFactory {
    static getAffiliateRepo(): AffiliateRepository {
        return new HttpAffiliateRepository()
    }

    static getDashboardRepo(): DashboardRepository {
        return new HttpDashboardRepository()
    }
}