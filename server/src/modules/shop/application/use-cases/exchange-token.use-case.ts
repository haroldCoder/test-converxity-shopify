import { ShopifyAuthGateway } from "../../infrastructure/gateways";
import { PrismaShopRepository } from "../../infrastructure/repositories";
import { ShopifyAuthException } from "../../domain/exceptions";
import {
  ShopifyGraphqlClient,
  ShopifySubscriptionGateway,
} from "../../../../common/infrastructure/gateways";
import { ShopAuthResult } from "../../domain/entities";

export class ExchangeTokenUseCase {
  constructor(
    private readonly gateway: ShopifyAuthGateway,
    private readonly repo = new PrismaShopRepository()
  ) { }

  async execute(
    input: { shop: string; code: string }
  ): Promise<ShopAuthResult> {
    const response = await this.gateway.exchangeToken(
      input.shop,
      input.code
    );

    if (!response.access_token) {
      throw new ShopifyAuthException(
        "Failed to receive access token from Shopify"
      );
    }

    const shop = await this.repo.upsert({
      domain: input.shop,
      accessToken: response.access_token,
    });

    let confirmationUrl: string | undefined;

    // --- Subscription Plan Initiation ---
    try {
      const graphqlClient = new ShopifyGraphqlClient(
        input.shop,
        response.access_token
      );
      const subscriptionGateway =
        new ShopifySubscriptionGateway(graphqlClient);

      // La URL de retorno debería ser la URL del dashboard de tu app
      const returnUrl = `https://${input.shop}/admin/apps/test-converxity-affiliates`;

      const confirmationUrlResponse =
        await subscriptionGateway.createCappedPlan(
          returnUrl
        );

      confirmationUrl = confirmationUrlResponse ?? undefined;
    } catch (error) {
      console.error(
        "Error initiating subscription plan:",
        error
      );
    }

    return {
      ...shop,
      confirmationUrl,
    };
  }
}