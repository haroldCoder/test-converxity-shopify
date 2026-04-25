export class ShopNotFoundException extends Error {
    constructor(identifier: string) {
        super(`Shop with identifier ${identifier} not found`);
        this.name = "ShopNotFoundException";
    }
}
