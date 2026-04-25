export class UsageChargeResponseDto {
    id: string;
    conversionId: string;
    amount: number;
    createdAt: string;

    constructor(partial: Partial<UsageChargeResponseDto>) {
        Object.assign(this, partial);
    }
}
