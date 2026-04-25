export class AffiliateResponseDto {
    id: string;
    shopId: string;
    name: string;
    code: string;
    commissionPercent: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;

    constructor(partial: Partial<AffiliateResponseDto>) {
        Object.assign(this, partial);
    }
}
