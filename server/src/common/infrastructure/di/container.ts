import { Logger } from "../logging";
import { PrismaAffiliateRepository, PrismaBillingRepository, PrismaConvertionRepository, PrismaMetricsRepository } from "../repositories";

export class ContainerFactory {
    static affiliateRepository() {
        return new PrismaAffiliateRepository();
    }

    static metricsRepository() {
        return new PrismaMetricsRepository();
    }

    static billingRepository() {
        return new PrismaBillingRepository();
    }

    static convertionRepository() {
        return new PrismaConvertionRepository();
    }

    static logger() {
        return new Logger();
    }
}