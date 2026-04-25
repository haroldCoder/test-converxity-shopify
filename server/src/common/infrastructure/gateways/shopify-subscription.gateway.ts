import { IShopifyGraphqlClient } from '../../domain/ports';

/** Respuesta para la mutación appSubscriptionCreate */
interface CreateCappedPlanData {
  appSubscriptionCreate: {
    confirmationUrl: string | null;
    userErrors: { message: string }[];
  };
}

/** Respuesta para la consulta currentAppInstallation */
interface GetActiveSubscriptionData {
  currentAppInstallation: {
    activeSubscriptions: {
      id: string;
      lineItems: {
        id: string;
        plan: {
          appUsagePricingDetails: {
            cappedAmount: { amount: string };
          };
        };
      }[];
    }[];
  };
}

/**
 * ShopifySubscriptionGateway — mapea las operaciones del dominio de suscripción a Shopify GraphQL.
 *
 * Depende de IShopifyGraphqlClient (port) — nunca de la clase HTTP concreta.
 * Los reintentos por limitación de tasa son manejados transparentemente por el cliente inyectado.
 */
export class ShopifySubscriptionGateway {
  constructor(
    private readonly client: IShopifyGraphqlClient,
  ) { }

  async createCappedPlan(returnUrl: string): Promise<string | null> {
    const mutation = /* GraphQL */ `
      mutation CreateSub {
        appSubscriptionCreate(
          name: "Affiliate Plan"
          returnUrl: "${returnUrl}"
          lineItems: [
            {
              plan: {
                appUsagePricingDetails: {
                  cappedAmount: { amount: 100, currencyCode: USD }
                  terms: "5% per referred sale"
                }
              }
            }
          ]
        ) {
          confirmationUrl
          userErrors {
            message
          }
        }
      }
    `;

    const data = await this.client.request<CreateCappedPlanData>(mutation);

    const { confirmationUrl, userErrors } = data.appSubscriptionCreate;
    if (userErrors.length > 0) {
      throw new Error(
        `Shopify subscription userErrors: ${userErrors.map((e) => e.message).join('; ')}`,
      );
    }

    return confirmationUrl;
  }

  async getActiveSubscription(): Promise<GetActiveSubscriptionData['currentAppInstallation']> {
    const query = /* GraphQL */ `
      query GetActiveSubscription {
        currentAppInstallation {
          activeSubscriptions {
            id
            lineItems {
              id
              plan {
                appUsagePricingDetails {
                  cappedAmount {
                    amount
                  }
                }
              }
            }
          }
        }
      }
    `;

    const data = await this.client.request<GetActiveSubscriptionData>(query);
    return data.currentAppInstallation;
  }
}