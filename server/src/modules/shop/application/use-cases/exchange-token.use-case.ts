import { ShopifyAuthGateway } from "../../infrastructure/gateways";
import { PrismaShopRepository } from "../../infrastructure/repositories";

export class ExchangeTokenUseCase {
  constructor(
    private auth: ShopifyAuthGateway,
    private repo =
      new PrismaShopRepository()
  ) {}

  async execute(input: {
    shop: string;
    code: string;
  }) {
    const token =
      await this.auth.exchangeToken(
        input.shop,
        input.code
      );

    await this.repo.upsert({
      domain: input.shop,
      accessToken:
        token.access_token,
    });

    return token;
  }
}