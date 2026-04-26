import { Module } from "@nestjs/common";
import { ShopsModule } from "../../shop/presentation/shop.module";
import { DashboardController } from "./dashboard.controller";
import { GetDashboardMetricsUseCase } from "../application/use-cases";
import { PrismaDashboardRepository } from "../infrastructure/repositories";

@Module({
  imports: [ShopsModule],
  controllers: [
    DashboardController,
  ],
  providers: [
    PrismaDashboardRepository,
    GetDashboardMetricsUseCase,
  ],
})
export class DashboardModule { }