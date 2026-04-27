import { env } from "@/common/infrastructure/config/env";

export class InstallShopUseCase {
  execute(shop: string) {
    const apiKey =
      env.shopifyApiKey;

    const scopes =
      "read_orders,write_products";

    const redirectUri =
      env.shopifyRedirectUri;

    return `https://${shop}/admin/oauth/authorize?client_id=${apiKey}&scope=${scopes}`; // no se puede devolver al mismo dominio, por eso no se pone el redirect_uri
  }
}