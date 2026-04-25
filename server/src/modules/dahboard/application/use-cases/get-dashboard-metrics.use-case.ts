import { PrismaDashboardRepository } from "../../infrastructure/repositories";
import { PrismaShopRepository } from "@/modules/shop/infrastructure/repositories";
import { ShopNotFoundException } from "@/modules/shop/domain/exceptions";

export class GetDashboardMetricsUseCase {
  constructor(
    private readonly repo = new PrismaDashboardRepository(),
    private readonly shopRepo = new PrismaShopRepository()
  ) { }

  async execute(shopId: string) {
    const shop = await this.shopRepo.findById(shopId);
    if (!shop) {
      throw new ShopNotFoundException(shopId);
    }

    return this.repo.getMetrics(shopId);
  }
}