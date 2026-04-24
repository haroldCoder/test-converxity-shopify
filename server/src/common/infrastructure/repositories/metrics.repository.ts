import { prisma } from "../database/prisma/client";

export class PrismaMetricsRepository {
  async getDashboard(shopId: string) {
    const conversions =
      await prisma.conversion.findMany({
        where: { shopId },
      });

    const totalSales =
      conversions.reduce(
        (acc, item) => acc + item.total,
        0
      );

    const totalAppFees =
      conversions.reduce(
        (acc, item) => acc + item.appFee,
        0
      );

    const totalAffiliateFees =
      conversions.reduce(
        (acc, item) =>
          acc + item.affiliateFee,
        0
      );

    return {
      totalSales,
      totalAppFees,
      totalAffiliateFees,
    };
  }
}