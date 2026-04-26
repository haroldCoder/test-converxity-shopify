import { Module } from "@nestjs/common";
import { ShopsModule } from "../../shop/presentation/shop.module";
import { BillingController } from "./billing.controller";
import { BillingConsumer } from "./billing.consumer";
import { CreateUsageChargeUseCase } from "../application/use-cases";
import { PrismaBillingRepository } from "@/common/infrastructure/repositories/prisma-billing.repository";

@Module({
  imports: [ShopsModule],
  controllers: [
    BillingController,
    BillingConsumer,
  ],
  providers: [
    CreateUsageChargeUseCase,
    PrismaBillingRepository,
  ],
})
export class BillingModule { }