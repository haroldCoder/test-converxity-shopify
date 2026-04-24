import crypto from "crypto";

export function verifyHmac(
  body: string,
  secret: string,
  received: string
) {
  const generated = crypto
    .createHmac("sha256", secret)
    .update(body, "utf8")
    .digest("base64");

  return generated === received;
}