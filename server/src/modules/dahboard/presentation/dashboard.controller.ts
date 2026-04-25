import {
  Controller,
  Get,
  Query,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";

import { GetDashboardMetricsUseCase } from "../application/use-cases";
import { ApiResponse } from "@/common/presentation/utils/api-response";
import { DashboardMetricsDto } from "./dto";
import { ShopNotFoundException } from "@/modules/shop/domain/exceptions";

@Controller("api/dashboard")
export class DashboardController {
  @Get()
  async getMetrics(
    @Query("shopId") shopId: string
  ): Promise<ApiResponse<DashboardMetricsDto>> {
    try {
      const useCase = new GetDashboardMetricsUseCase();
      const metrics = await useCase.execute(shopId);

      const data = new DashboardMetricsDto(metrics);

      return ApiResponse.success(
        "Dashboard metrics retrieved successfully",
        data
      );
    } catch (error) {
      if (error instanceof ShopNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(
        error.message
      );
    }
  }
}