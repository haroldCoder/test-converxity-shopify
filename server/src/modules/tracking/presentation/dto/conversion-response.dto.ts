export class ConversionResponseDto {
    id: string;
    orderId: string;
    total: number;
    appFee: number;
    affiliateFee: number;
    createdAt: string;

    constructor(partial: Partial<ConversionResponseDto>) {
        Object.assign(this, partial);
    }
}
