import {
    ShopifyGraphqlException,
    ShopifyRateLimitException,
} from '../../domain/exceptions';
import {
    CostExtension,
    GraphqlError,
    GraphqlResponse,
} from './shopify-graphql.types';

/**
 * ShopifyGraphqlErrorParser — Responsabilidad única: interpretar errores de la API de Shopify.
 *
 * Separa la lógica de parsing de errores de la lógica de transporte HTTP,
 * permitiendo que ambos evolucionen de forma independiente (OCP).
 *
 * Lanza:
 *  - ShopifyRateLimitException si el código de error es THROTTLED
 *  - ShopifyGraphqlException   para cualquier otro error GraphQL
 */
export class ShopifyGraphqlErrorParser {

    /**
     * Analiza la respuesta JSON de Shopify y lanza la excepción correspondiente
     * si contiene errores. Si no hay errores, retorna el campo `data`.
     */
    parse<T>(response: GraphqlResponse<T>): T {
        if (response.errors?.length) {
            this.handleErrors(response.errors, response.extensions?.cost);
        }
        return response.data as T;
    }

    private handleErrors(errors: GraphqlError[], cost?: CostExtension): never {
        const throttledError = errors.find(
            (e) => e.extensions?.code === 'THROTTLED',
        );

        if (throttledError) {
            throw new ShopifyRateLimitException(this.computeThrottleDelay(cost));
        }

        throw new ShopifyGraphqlException(
            `Shopify GraphQL errors: ${errors.map((e) => e.message).join('; ')}`,
            errors,
        );
    }

    /**
     * Calcula los ms a esperar usando la extensión de costo del leaky bucket de Shopify.
     *
     * Fórmula: ceil((requestedCost - currentlyAvailable) / restoreRate) * 1000 + 200ms de margen
     */
    private computeThrottleDelay(cost?: CostExtension): number {
        if (!cost) return 1_000;

        const { requestedQueryCost, throttleStatus } = cost;
        const { currentlyAvailable, restoreRate } = throttleStatus;
        const deficit = requestedQueryCost - currentlyAvailable;

        if (deficit <= 0) return 500;

        return Math.ceil(deficit / restoreRate) * 1_000 + 200;
    }
}
