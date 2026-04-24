import { ShopifyGraphqlClient } from "./shopify-graphql-client.gateway";

export class ShopifySubscriptionGateway {
  constructor(
    private readonly client: ShopifyGraphqlClient
  ) {}

  async createCappedPlan(
    returnUrl: string
  ) {
    const mutation = `
      mutation CreateSub {
        appSubscriptionCreate(
          name: "Affiliate Plan",
          returnUrl: "${returnUrl}",
          lineItems: [
            {
              plan: {
                appUsagePricingDetails: {
                  cappedAmount: {
                    amount: 100,
                    currencyCode: USD
                  }
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

    return this.client.request(
      mutation
    );
  }
}