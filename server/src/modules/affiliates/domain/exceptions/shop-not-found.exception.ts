export class ShopNotFoundException extends Error {
    constructor(shopId: string) {
        super(`Shop with ID ${shopId} not found`);
        this.name = "ShopNotFoundException";
    }
}
