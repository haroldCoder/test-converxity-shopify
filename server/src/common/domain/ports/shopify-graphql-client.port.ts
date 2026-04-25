/**
 * Puerto (inversion de dependencias) para la comunicación GraphQL de Shopify.
 *
 * El código de la aplicación y del dominio DEBE depender solo de esta interfaz,
 * nunca de la implementación HTTP concreta. Esto mantiene el núcleo
 * de la lógica totalmente desacoplado de las preocupaciones de infraestructura, como
 * la limitación de velocidad, los reintentos o los detalles de transporte.
 *
 * @template T - Shape of the `data` field expected in the response.
 */
export interface IShopifyGraphqlClient {
    /**
     * Ejecuta una consulta o mutación GraphQL contra la API de administración de Shopify.
     *
     * @param query     - Cadena de consulta / mutación GraphQL.
     * @param variables - Mapa de variables opcional.
     * @returns El campo `data` de una respuesta GraphQL exitosa.
     * @throws {ShopifyRateLimitException} cuando se limita después de todos los reintentos.
     * @throws {ShopifyGraphqlException}   en errores de nivel GraphQL o HTTP.
     */
    request<T = unknown>(
        query: string,
        variables?: Record<string, unknown>,
    ): Promise<T>;
}
