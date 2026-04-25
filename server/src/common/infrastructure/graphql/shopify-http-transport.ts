import {
    ShopifyGraphqlException,
    ShopifyRateLimitException,
} from '../../domain/exceptions';
import { GraphqlResponse } from './shopify-graphql.types';

export interface ShopifyHttpTransportConfig {
    shop: string;
    token: string;
    apiVersion?: string;
}

/**
 * ShopifyHttpTransport — Responsabilidad única: llevar bytes desde/hacia Shopify.
 *
 * Solo sabe cómo construir la URL, los headers y el body, y retornar el JSON crudo.
 * No sabe nada sobre reintentos, leaky bucket ni errores de dominio (excepto HTTP crudo).
 *
 * Al ser una clase independiente, puede ser sustituida por un mock en tests
 * sin tocar nada del parser ni del cliente orquestador (DIP, OCP).
 */
export class ShopifyHttpTransport {
    private readonly url: string;
    private readonly token: string;

    constructor({ shop, token, apiVersion = '2026-01' }: ShopifyHttpTransportConfig) {
        this.url = `https://${shop}/admin/api/${apiVersion}/graphql.json`;
        this.token = token;
    }

    /**
     * Envía la solicitud HTTP y retorna el JSON crudo de la respuesta.
     * Lanza ShopifyRateLimitException en HTTP 429 y ShopifyGraphqlException en otros errores HTTP.
     */
    async send<T>(
        query: string,
        variables?: Record<string, unknown>,
    ): Promise<GraphqlResponse<T>> {
        let response: Response;

        try {
            response = await fetch(this.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': this.token,
                },
                body: JSON.stringify({ query, variables }),
            });
        } catch (networkError) {
            throw new ShopifyGraphqlException(
                `Error de red al llamar Shopify GraphQL: ${(networkError as Error).message}`,
            );
        }

        if (response.status === 429) {
            const retryAfterSec = Number(response.headers.get('Retry-After') ?? '1');
            throw new ShopifyRateLimitException(retryAfterSec * 1_000);
        }

        if (!response.ok) {
            throw new ShopifyGraphqlException(
                `Error HTTP de Shopify GraphQL ${response.status}: ${response.statusText}`,
            );
        }

        try {
            return (await response.json()) as GraphqlResponse<T>;
        } catch {
            throw new ShopifyGraphqlException('Shopify GraphQL retornó JSON inválido');
        }
    }
}
