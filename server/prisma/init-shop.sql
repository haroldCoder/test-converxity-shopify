-- Insert test shop if it doesn't exist
INSERT INTO "Shop" ("id", "domain", "accessToken", "updatedAt")
VALUES ('test-shop', 'test-shop.myshopify.com', 'placeholder-token', NOW())
ON CONFLICT ("id") DO NOTHING;
