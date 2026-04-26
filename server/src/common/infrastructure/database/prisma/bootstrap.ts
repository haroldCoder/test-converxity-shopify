import { prisma } from "./client";

export async function bootstrapDevData() {
    const shopId = "test-shop";
    const domain = "test-shop.myshopify.com";

    const shop = await prisma.shop.findUnique({
        where: { id: shopId },
    });

    if (!shop) {
        console.log(`[Bootstrap] Creating test shop: ${shopId}`);
        await prisma.shop.create({
            data: {
                id: shopId,
                domain: domain,
                accessToken: "test-token",
            },
        });

        // Also create a test affiliate for convenience
        await prisma.affiliate.create({
            data: {
                id: "test-affiliate",
                shopId: shopId,
                name: "Test Affiliate",
                code: "TEST10",
                commissionPercent: 10,
            }
        });
        console.log(`[Bootstrap] Test shop and affiliate created.`);
    }
}
