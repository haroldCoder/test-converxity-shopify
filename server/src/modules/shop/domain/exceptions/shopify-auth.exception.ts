export class ShopifyAuthException extends Error {
    constructor(message: string) {
        super(`Shopify Auth Error: ${message}`);
        this.name = "ShopifyAuthException";
    }
}
