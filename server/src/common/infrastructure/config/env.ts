export const env = {
    port: Number(
        process.env.PORT || 3001
    ),
    databaseUrl:
        process.env.DATABASE_URL ||
        "",
    shopifyApiKey:
        process.env.SHOPIFY_API_KEY ||
        "",
    shopifyApiSecret:
        process.env
            .SHOPIFY_API_SECRET || "",
    shopifyRedirectUri:
        process.env.SHOPIFY_APP_URL ||
        "",
};