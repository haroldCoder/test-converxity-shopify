import { PrismaDashboardRepository } from "../../infrastructure/repositories";

export class GetDashboardMetricsUseCase {
  constructor(
    private repo =
      new PrismaDashboardRepository()
  ) {}

  execute(shopId: string) {
    return this.repo.getMetrics(
      shopId
    );
  }
}