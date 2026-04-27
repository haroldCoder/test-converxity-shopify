import type { Affiliate } from "../../domain/entities";
import type { ApiResponseAffiliatesEntity } from "../entities/api-response-affiliates.entity";

export class ConvertApiAffiliatesToAffiliatesMapper {
    static map(apiAffiliates: ApiResponseAffiliatesEntity[]): Affiliate[] {
        return apiAffiliates.map((apiAffiliate) => {
            return {
                id: apiAffiliate.id,
                name: apiAffiliate.name,
                code: apiAffiliate.code,
                commissionPercent: apiAffiliate.commissionPercent,
                shopId: apiAffiliate.shopId,
                totalToPay: apiAffiliate.conversions.reduce((acc, c) => acc + c.affiliateFee, 0),
            };
        });
    }
}