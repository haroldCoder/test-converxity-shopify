import { IShopifyGraphqlClient } from '../../domain/ports';
import { ShopifyRateLimitException } from '../../domain/exceptions';
import { ShopifyGraphqlErrorParser, ShopifyHttpTransport, ShopifyRetryPolicy, RetryPolicyOptions } from '../graphql';

/**
 * ShopifyGraphqlClient — Orquestador. Única responsabilidad: coordinar el flujo de reintentos.
 *
 * Delega:
 *  - Transporte HTTP        → ShopifyHttpTransport
 *  - Parsing de errores     → ShopifyGraphqlErrorParser
 *  - Política de reintentos → ShopifyRetryPolicy
 *
 * Implementa IShopifyGraphqlClient (DIP): la capa de aplicación nunca importa esta clase.
 * Open/Closed: cada colaborador puede sustituirse sin tocar los demás.
 */
export class ShopifyGraphqlClient implements IShopifyGraphqlClient {
  private readonly transport: ShopifyHttpTransport;
  private readonly parser: ShopifyGraphqlErrorParser;
  private readonly retryPolicy: ShopifyRetryPolicy;

  constructor(
    shop: string,
    token: string,
    retryOptions?: RetryPolicyOptions,
  ) {
    this.transport = new ShopifyHttpTransport({ shop, token });
    this.parser = new ShopifyGraphqlErrorParser();
    this.retryPolicy = new ShopifyRetryPolicy(retryOptions);
  }

  async request<T = unknown>(
    query: string,
    variables?: Record<string, unknown>,
  ): Promise<T> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= this.retryPolicy.attempts; attempt++) {
      try {
        const raw = await this.transport.send<T>(query, variables);
        return this.parser.parse(raw);
      } catch (err) {
        lastError = err;

        if (!this.retryPolicy.shouldRetry(err, attempt)) {
          throw err;
        }

        const delay = this.retryPolicy.delayFor(
          attempt,
          (err as ShopifyRateLimitException).retryAfterMs,
        );
        await this.retryPolicy.wait(delay);
      }
    }

    throw lastError;
  }
}