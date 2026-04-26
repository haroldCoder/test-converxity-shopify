import { Module } from "@nestjs/common";
import { ShopsModule } from "../../shop/presentation/shop.module";
import { TrackingController } from "./tracking.controller";
import { RegisterConversionUseCase } from "../application/use-cases";
import { PrismaTrackingRepository } from "../infrastructure/repositories";

@Module({
  imports: [
    ShopsModule,
  ],
  controllers: [
    TrackingController,
  ],
  providers: [
    PrismaTrackingRepository,
    RegisterConversionUseCase,
  ],
})
export class TrackingModule { }