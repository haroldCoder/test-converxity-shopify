/**
 * Dominio base para errores de Shopify.
 */
export class ShopifyGraphqlException extends Error {
    constructor(
        message: string,
        public readonly errors: unknown[] = [],
    ) {
        super(message);
        this.name = 'ShopifyGraphqlException';
        // Soluciona el problema de la cadena de prototipos en código transpilado
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
