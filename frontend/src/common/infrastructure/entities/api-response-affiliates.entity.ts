export interface ApiResponseAffiliatesEntity {
    id: string;
    name: string;
    code: string;
    commissionPercent: number;
    shopId: string;
    affiliateFee: number;
    conversions: Array<{ // esto nos puede servir como un historial de comisiones
        affiliateFee: number;
    }>;
}