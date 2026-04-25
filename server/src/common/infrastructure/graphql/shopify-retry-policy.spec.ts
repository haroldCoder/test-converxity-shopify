import { ShopifyGraphqlClient } from '../gateways';
import { ShopifyRetryPolicy } from './shopify-retry-policy';
import {
    ShopifyGraphqlException,
    ShopifyRateLimitException,
} from '../../domain/exceptions';


/** construye una respuesta exitosa de GraphQL */
const makeSuccessResponse = <T>(data: T) =>
    new Response(JSON.stringify({ data }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });

/** construye una respuesta HTTP 429 con un encabezado Retry-After opcional */
const make429Response = (retryAfterSec = 2) =>
    new Response(null, {
        status: 429,
        headers: { 'Retry-After': String(retryAfterSec) },
    });

/** construye una respuesta GraphQL con un error THROTTLED y extensiones de costo opcionales */
const makeThrottledResponse = (requestedCost = 100, available = 20, restoreRate = 50) =>
    new Response(
        JSON.stringify({
            errors: [
                {
                    message: 'Throttled',
                    extensions: { code: 'THROTTLED' },
                },
            ],
            extensions: {
                cost: {
                    requestedQueryCost: requestedCost,
                    actualQueryCost: null,
                    throttleStatus: {
                        maximumAvailable: 1000,
                        currentlyAvailable: available,
                        restoreRate,
                    },
                },
            },
        }),
        {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        },
    );


describe('ShopifyRetryPolicy', () => {
    let policy: ShopifyRetryPolicy;

    beforeEach(() => {
        policy = new ShopifyRetryPolicy({ maxRetries: 3, baseDelayMs: 100, maxDelayMs: 800 });
    });

    it('should not retry on non-rate-limit errors', () => {
        const err = new ShopifyGraphqlException('some error', []);
        expect(policy.shouldRetry(err, 0)).toBe(false);
    });

    it('should retry on ShopifyRateLimitException when attempts remain', () => {
        const err = new ShopifyRateLimitException(500);
        expect(policy.shouldRetry(err, 0)).toBe(true);
        expect(policy.shouldRetry(err, 2)).toBe(true);
    });

    it('should stop retrying when maxRetries is reached', () => {
        const err = new ShopifyRateLimitException(500);
        expect(policy.shouldRetry(err, 3)).toBe(false);
    });

    it('honours server-provided retryAfterMs in delayFor', () => {
        const delay = policy.delayFor(0, 5000);
        expect(delay).toBe(5000);
    });

    it('returns a jittered exponential delay when no hint given', () => {
        const delay = policy.delayFor(2);
        // 100 * 2^2 = 400ms, capped at 800ms; with full jitter: 0 <= delay <= 400
        expect(delay).toBeGreaterThanOrEqual(0);
        expect(delay).toBeLessThanOrEqual(400);
    });
});

describe('ShopifyGraphqlClient', () => {
    const SHOP = 'test.myshopify.com';
    const TOKEN = 'shpat_test';
    const QUERY = '{ shop { name } }';

    let fetchMock: jest.SpyInstance;
    let waitMock: jest.SpyInstance;

    beforeEach(() => {
        fetchMock = jest.spyOn(global, 'fetch');
        // ShopifyRetryPolicy.prototype.wait para evitar retrasos reales en las pruebas
        waitMock = jest
            .spyOn(ShopifyRetryPolicy.prototype, 'wait')
            .mockResolvedValue(undefined);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('returns data on a successful response', async () => {
        fetchMock.mockResolvedValueOnce(makeSuccessResponse({ shop: { name: 'Test' } }));

        const client = new ShopifyGraphqlClient(SHOP, TOKEN);
        const result = await client.request<{ shop: { name: string } }>(QUERY);

        expect(result.shop.name).toBe('Test');
    });

    it('throws ShopifyRateLimitException on HTTP 429', async () => {
        // Agota todos los reintentos
        fetchMock.mockResolvedValue(make429Response(1));

        const client = new ShopifyGraphqlClient(SHOP, TOKEN, { maxRetries: 2 });
        await expect(client.request(QUERY)).rejects.toBeInstanceOf(ShopifyRateLimitException);
        // fetch llamado: 1 inicial + 2 reintentos = 3 veces
        expect(fetchMock).toHaveBeenCalledTimes(3);
    });

    it('throws ShopifyRateLimitException on THROTTLED GraphQL error after exhausting retries', async () => {
        // El cuerpo de la respuesta es un flujo de una sola vez — usa mockImplementation para obtener una instancia nueva cada vez
        fetchMock.mockImplementation(() =>
            Promise.resolve(makeThrottledResponse()),
        );

        // maxRetries: 1 → attempt 0 + 1 retry = 2 fetch calls, then throws
        const client = new ShopifyGraphqlClient(SHOP, TOKEN, { maxRetries: 1 });
        await expect(client.request(QUERY)).rejects.toBeInstanceOf(ShopifyRateLimitException);
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('retries then succeeds after a THROTTLED response', async () => {
        fetchMock
            .mockResolvedValueOnce(makeThrottledResponse())
            .mockResolvedValueOnce(makeSuccessResponse({ shop: { name: 'Recovered' } }));

        const client = new ShopifyGraphqlClient(SHOP, TOKEN, { maxRetries: 3 });
        const result = await client.request<{ shop: { name: string } }>(QUERY);

        expect(result.shop.name).toBe('Recovered');
        expect(fetchMock).toHaveBeenCalledTimes(2);
        // wait() debería haber sido llamado una vez entre intentos
        expect(waitMock).toHaveBeenCalledTimes(1);
    });

    it('computes correct throttle delay from cost extensions', async () => {
        // requestedCost=100, available=20, restoreRate=50 → deficit=80 → ceil(80/50)=2s → 2200ms
        fetchMock
            .mockResolvedValueOnce(makeThrottledResponse(100, 20, 50))
            .mockResolvedValueOnce(makeSuccessResponse({}));

        const client = new ShopifyGraphqlClient(SHOP, TOKEN, { maxRetries: 3 });
        await client.request(QUERY);

        expect(waitMock).toHaveBeenCalledTimes(1);
        // delayFor se llama con el retryAfterMs de ShopifyRateLimitException (2200)
        const calledWith = waitMock.mock.calls[0][0] as number;
        expect(calledWith).toBe(2200);
    });

    it('throws ShopifyGraphqlException on non-throttle GraphQL errors', async () => {
        fetchMock.mockResolvedValueOnce(
            new Response(
                JSON.stringify({
                    errors: [{ message: 'Access denied', extensions: { code: 'ACCESS_DENIED' } }],
                }),
                { status: 200, headers: { 'Content-Type': 'application/json' } },
            ),
        );

        const client = new ShopifyGraphqlClient(SHOP, TOKEN);
        await expect(client.request(QUERY)).rejects.toBeInstanceOf(ShopifyGraphqlException);
        // No debería haber reintentado
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('throws ShopifyGraphqlException on non-OK HTTP status', async () => {
        fetchMock.mockResolvedValueOnce(
            new Response(null, { status: 500, statusText: 'Internal Server Error' }),
        );

        const client = new ShopifyGraphqlClient(SHOP, TOKEN);
        await expect(client.request(QUERY)).rejects.toBeInstanceOf(ShopifyGraphqlException);
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('throws ShopifyGraphqlException on network failure', async () => {
        fetchMock.mockRejectedValueOnce(new Error('ECONNREFUSED'));

        const client = new ShopifyGraphqlClient(SHOP, TOKEN);
        await expect(client.request(QUERY)).rejects.toBeInstanceOf(ShopifyGraphqlException);
    });
});
