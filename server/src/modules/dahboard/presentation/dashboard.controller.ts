import {
  Controller,
  Get,
  Query,
} from "@nestjs/common";

import { GetDashboardMetricsUseCase } from "../application/use-cases";

@Controller("api/dashboard")
export class DashboardController {
  @Get()
  async getMetrics(
    @Query("shopId") shopId: string
  ) {
    const useCase =
      new GetDashboardMetricsUseCase();

    return useCase.execute(shopId);
  }
}