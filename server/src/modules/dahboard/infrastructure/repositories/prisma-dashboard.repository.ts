import { prisma } from "@/common/infrastructure/database/prisma";

export class PrismaDashboardRepository {
  async getMetrics(
    shopId: string
  ) {
    const rows =
      await prisma.conversion.findMany({
        where: { shopId },
      });

    const totalSales =
      rows.reduce(
        (sum, item) =>
          sum + item.total,
        0
      );

    const totalAppFees =
      rows.reduce(
        (sum, item) =>
          sum + item.appFee,
        0
      );

    const totalAffiliateFees =
      rows.reduce(
        (sum, item) =>
          sum +
          item.affiliateFee,
        0
      );

    const totalConversions =
      rows.length;

    return {
      totalSales,
      totalAppFees,
      totalAffiliateFees,
      totalConversions,
    };
  }
}