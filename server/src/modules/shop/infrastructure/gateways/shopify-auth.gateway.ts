export class ShopifyAuthGateway {
  async exchangeToken(
    shop: string,
    code: string
  ) {
    const response = await fetch(
      `https://${shop}/admin/oauth/access_token`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          client_id:
            process.env
              .SHOPIFY_API_KEY,
          client_secret:
            process.env
              .SHOPIFY_API_SECRET,
          code,
        }),
      }
    );

    return response.json();
  }
}