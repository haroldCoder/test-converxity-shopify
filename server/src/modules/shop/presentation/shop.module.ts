import { Module } from "@nestjs/common";
import { ShopsController } from "./shop.controller";

@Module({
  controllers: [
    ShopsController,
  ],
})
export class ShopsModule {}