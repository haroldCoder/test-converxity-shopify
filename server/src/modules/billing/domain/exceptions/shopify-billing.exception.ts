export class ShopifyBillingException extends Error {
    constructor(message: string) {
        super(`Shopify Billing Error: ${message}`);
        this.name = "ShopifyBillingException";
    }
}
