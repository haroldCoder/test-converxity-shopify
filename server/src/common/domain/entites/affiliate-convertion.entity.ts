import { AffiliateEntity } from "./affiliate.entity";

export interface AffiliateConvertionEntity {
    affiliate: AffiliateEntity;
    convertion: {
        affiliateFee: number;
    };
}