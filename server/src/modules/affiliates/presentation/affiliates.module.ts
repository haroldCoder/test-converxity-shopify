import { Module } from "@nestjs/common";
import { AffiliatesController } from "./affiliates.controller";
import { CreateAffiliateUseCase } from "../application/use-cases/create-affiliate.use-case";
import { GetAffiliatesUseCase } from "../application/use-cases/get-affiliate.use-case";
import { DeleteAffiliateUseCase } from "../application/use-cases/delete-affiliate.use-case";
import { PrismaAffiliateRepository } from "@/common/infrastructure/repositories";
import { PrismaShopRepository } from "@/modules/shop/infrastructure/repositories";

@Module({
  controllers: [
    AffiliatesController,
  ],
  providers: [
    CreateAffiliateUseCase,
    GetAffiliatesUseCase,
    DeleteAffiliateUseCase,
    PrismaAffiliateRepository,
    PrismaShopRepository,
  ],
})
export class AffiliatesModule { }