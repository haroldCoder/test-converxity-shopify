import { IShopifyGraphqlClient } from '../../domain/ports';

/** Response shape for appUsageRecordCreate mutation */
interface CreateUsageChargeData {
  appUsageRecordCreate: {
    appUsageRecord: { id: string } | null;
    userErrors: { message: string }[];
  };
}

/**
 * ShopifyBillingGateway — mapea las operaciones del dominio de facturación a las mutaciones GraphQL de Shopify.
 *
 * Depende de IShopifyGraphqlClient (port), no de ninguna clase HTTP concreta.
 * Los errores de limitación de tasa y los reintentos son manejados transparentemente por el cliente inyectado.
 */
export class ShopifyBillingGateway {
  constructor(
    private readonly client: IShopifyGraphqlClient,
  ) { }

  async createUsageCharge(
    subscriptionLineItemId: string,
    amount: number,
    description: string,
  ): Promise<void> {
    const mutation = /* GraphQL */ `
      mutation CreateUsage(
        $subscriptionLineItemId: ID!
        $description: String!
        $price: MoneyInput!
      ) {
        appUsageRecordCreate(
          subscriptionLineItemId: $subscriptionLineItemId
          description: $description
          price: $price
        ) {
          appUsageRecord {
            id
          }
          userErrors {
            message
          }
        }
      }
    `;

    const data = await this.client.request<CreateUsageChargeData>(mutation, {
      subscriptionLineItemId,
      description,
      price: { amount, currencyCode: 'USD' },
    });

    const { userErrors } = data.appUsageRecordCreate;
    if (userErrors.length > 0) {
      throw new Error(
        `Shopify billing userErrors: ${userErrors.map((e) => e.message).join('; ')}`,
      );
    }
  }
}