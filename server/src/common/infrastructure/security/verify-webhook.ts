import { verifyHmac } from "./verify-hmac";

export function verifyWebhook(
  rawBody: string,
  hmacHeader: string
) {
  return verifyHmac(
    rawBody,
    process.env
      .SHOPIFY_API_SECRET || "",
    hmacHeader
  );
}