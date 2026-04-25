import { ShopifyAuthGateway } from "../../infrastructure/gateways";
import { PrismaShopRepository } from "../../infrastructure/repositories";
import { ShopifyGraphqlClient, ShopifySubscriptionGateway } from "../../../../common/infrastructure/gateways";

export class ExchangeTokenUseCase {
  constructor(
    private auth: ShopifyAuthGateway,
    private repo = new PrismaShopRepository()
  ) { }

  async execute(input: {
    shop: string;
    code: string;
  }) {
    const token = await this.auth.exchangeToken(
      input.shop,
      input.code
    );

    await this.repo.upsert({
      domain: input.shop,
      accessToken: token.access_token,
    });

    // --- Subscription Plan Initiation ---
    try {
      const graphqlClient = new ShopifyGraphqlClient(input.shop, token.access_token);
      const subscriptionGateway = new ShopifySubscriptionGateway(graphqlClient);

      // La URL de retorno debería ser la URL del dashboard de tu app
      const returnUrl = `https://${input.shop}/admin/apps/test-converxity-affiliates`;

      const response = await subscriptionGateway.createCappedPlan(returnUrl);

      if (response.appSubscriptionCreate?.userErrors?.length > 0) {
        console.error('Subscription Error:', response.appSubscriptionCreate.userErrors);
      } else {
        return {
          ...token,
          confirmationUrl: response.appSubscriptionCreate?.confirmationUrl
        };
      }
    } catch (error) {
      console.error('Error initiating subscription:', error);
    }

    return token;
  }
}