import { Module } from "@nestjs/common";
import { ShopsController } from "./shop.controller";
import { PrismaShopRepository } from "../infrastructure/repositories";
import {
  InstallShopUseCase,
  ExchangeTokenUseCase,
} from "../application/use-cases";
import { ShopifyAuthGateway } from "../infrastructure/gateways";

@Module({
  controllers: [
    ShopsController,
  ],
  providers: [
    PrismaShopRepository,
    InstallShopUseCase,
    ExchangeTokenUseCase,
    ShopifyAuthGateway,
  ],
  exports: [
    PrismaShopRepository,
  ],
})
export class ShopsModule { }