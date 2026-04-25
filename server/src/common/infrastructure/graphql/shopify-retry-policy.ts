import { ShopifyRateLimitException } from '../../domain/exceptions';

export interface RetryPolicyOptions {
    /** numero maximo de reintentos antes de rendirse. Default: 3 */
    maxRetries?: number;
    /** delay base en ms para el primer reintento (se duplica cada intento). Default: 500 */
    baseDelayMs?: number;
    /** delay maximo en ms. Default: 16_000 */
    maxDelayMs?: number;
}

/**
 * ShopifyRetryPolicy  —  Unica responsabilidad: decide si y cuanto tiempo esperar antes de reintentar.
 *
 * Strategy: Exponencial back-off con full jitter.
 *   delay = random(0, min(maxDelay, baseDelay * 2^attempt))
 *
 * Esta estrategia imita el comportamiento de leaky-bucket que recomienda Shopify:
 *   - En caso de THROTTLED, respetamos el delay sugerido por el servidor cuando está disponible.
 *   - De lo contrario, retrocedemos exponencialmente para drenar el bucket de forma natural.
 *
 * Open/Closed Principle: los llamadores usan esto a través de la interfaz; el algoritmo
 * puede ser reemplazado (por ejemplo, ventana fija, cubo de tokens) sin tocar
 * ShopifyGraphqlClient.
 */
export class ShopifyRetryPolicy {
    private readonly maxRetries: number;
    private readonly baseDelayMs: number;
    private readonly maxDelayMs: number;

    constructor(options: RetryPolicyOptions = {}) {
        this.maxRetries = options.maxRetries ?? 3;
        this.baseDelayMs = options.baseDelayMs ?? 500;
        this.maxDelayMs = options.maxDelayMs ?? 16_000;
    }

    get attempts(): number {
        return this.maxRetries;
    }

    /**
     * Calcula cuánto tiempo esperar antes del intento `attemptIndex` (basado en 0).
     * Si el servidor proporcionó una pista `retryAfterMs` (de un error THROTTLED),
     * la respetamos; de lo contrario, usamos back-off exponencial + jitter.
     */
    delayFor(attemptIndex: number, retryAfterMs?: number): number {
        if (retryAfterMs != null && retryAfterMs > 0) {
            return retryAfterMs;
        }
        const exponential = this.baseDelayMs * Math.pow(2, attemptIndex);
        const capped = Math.min(exponential, this.maxDelayMs);
        // Full jitter: evita el thundering-herd cuando muchos workers reintentan juntos
        return Math.random() * capped;
    }

    /** Determina si debemos intentar otro reintento para este tipo de excepción. */
    shouldRetry(error: unknown, attempt: number): boolean {
        if (attempt >= this.maxRetries) return false;
        return error instanceof ShopifyRateLimitException;
    }

    /** Espera el delay calculado. Extraído para que las pruebas puedan espiar/sobrescribirlo. */
    async wait(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
