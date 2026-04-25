import { ShopifyGraphqlException } from './shopify-graphql.exception';

/**
 * Se lanza cuando Shopify devuelve un error GraphQL THROTTLED o HTTP 429.
 * Expone `retryAfterMs` para que los llamadores puedan implementar estrategias de back-off.
 */
export class ShopifyRateLimitException extends ShopifyGraphqlException {
    constructor(
        /** Milliseconds to wait before the next request is safe to send */
        public readonly retryAfterMs: number = 1000,
    ) {
        super('Shopify API rate limit exceeded (THROTTLED)', []);
        this.name = 'ShopifyRateLimitException';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
