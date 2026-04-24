import { ShopifyGraphqlClient } from "./shopify-graphql-client.gateway";

export class ShopifyBillingGateway {
  constructor(
    private readonly client: ShopifyGraphqlClient
  ) {}

  async createUsageCharge(
    subscriptionLineItemId: string,
    amount: number,
    description: string
  ) {
    const mutation = `
      mutation CreateUsage(
        $subscriptionLineItemId: ID!,
        $description: String!,
        $price: MoneyInput!
      ) {
        appUsageRecordCreate(
          subscriptionLineItemId:
            $subscriptionLineItemId,
          description: $description,
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

    return this.client.request(
      mutation,
      {
        subscriptionLineItemId,
        description,
        price: {
          amount,
          currencyCode: "USD",
        },
      }
    );
  }
}