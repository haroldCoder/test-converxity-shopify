import { Injectable } from "@nestjs/common";
import { env } from "@/common/infrastructure/config/env";

@Injectable()
export class InstallShopUseCase {

  execute(shop: string) {
    const apiKey =
      env.shopifyApiKey;

    const scopes =
      "read_orders,write_products";

    const redirectUri =
      env.shopifyRedirectUri;

    return `https://${shop}/admin/oauth/authorize?client_id=${apiKey}&scope=${scopes}&redirect_uri=${redirectUri}`;
  }
}