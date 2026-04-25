import {
  Controller,
  Get,
  Query,
  Res,
} from "@nestjs/common";

import type { Response } from "express";

import { InstallShopUseCase, ExchangeTokenUseCase } from "../application/use-cases";
import { ShopifyAuthGateway } from "../infrastructure/gateways";

@Controller("api/shops")
export class ShopsController {
  @Get("install")
  install(
    @Query("shop") shop: string,
    @Res() res: Response
  ) {
    const useCase =
      new InstallShopUseCase();

    const url =
      useCase.execute(shop);

    return res.redirect(url);
  }

  @Get("callback")
  async callback(
    @Query("shop") shop: string,
    @Query("code") code: string,
    @Res() res: Response
  ) {
    const gateway = new ShopifyAuthGateway();

    const useCase =
      new ExchangeTokenUseCase(gateway);

    const result = await useCase.execute({
      shop,
      code,
    });

    if (result && 'confirmationUrl' in result && result.confirmationUrl) {
      return res.redirect(result.confirmationUrl as string);
    }

    return res.json(result);
  }
}