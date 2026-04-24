export class ShopifyGraphqlClient {
  constructor(
    private readonly shop: string,
    private readonly token: string
  ) {}

  async request(
    query: string,
    variables?: Record<string, unknown>
  ) {
    const response = await fetch(
      `https://${this.shop}/admin/api/2026-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          "X-Shopify-Access-Token":
            this.token,
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      }
    );

    return response.json();
  }
}