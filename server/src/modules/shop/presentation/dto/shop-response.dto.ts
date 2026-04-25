export class ShopResponseDto {
    id: string;
    domain: string;
    installedAt: string;
    updatedAt: string;

    constructor(partial: Partial<ShopResponseDto>) {
        Object.assign(this, partial);
    }
}
