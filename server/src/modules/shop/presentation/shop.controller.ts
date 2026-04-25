import {
  Controller,
  Get,
  Query,
  Res,
  InternalServerErrorException,
  BadRequestException,
} from "@nestjs/common";

import type { Response } from "express";

import {
  InstallShopUseCase,
  ExchangeTokenUseCase,
} from "../application/use-cases";
import { ShopifyAuthGateway } from "../infrastructure/gateways";
import { ApiResponse } from "@/common/presentation/utils/api-response";
import { ShopResponseDto } from "./dto";
import { ShopifyAuthException } from "../domain/exceptions";
import { ShopAuthResult } from "../domain/entities";

@Controller("api/shops")
export class ShopsController {
  @Get("install")
  install(
    @Query("shop") shop: string,
    @Res() res: Response
  ) {
    const useCase = new InstallShopUseCase();
    const url = useCase.execute(shop);
    return res.redirect(url);
  }

  @Get("callback")
  async callback(
    @Query("shop") shop: string,
    @Query("code") code: string,
    @Res() res: Response
  ) {
    try {
      const gateway = new ShopifyAuthGateway();
      const useCase = new ExchangeTokenUseCase(
        gateway
      );

      const result: ShopAuthResult = await useCase.execute(
        {
          shop,
          code,
        }
      );

      if (result.confirmationUrl) {
        return res.redirect(result.confirmationUrl);
      }

      const data = new ShopResponseDto({
        id: result.id,
        domain: result.domain,
        installedAt: result.installedAt?.toISOString(),
        updatedAt: result.updatedAt?.toISOString(),
      });

      return res.json(
        ApiResponse.success(
          "Shop authenticated successfully",
          data
        )
      );
    } catch (error) {
      if (error instanceof ShopifyAuthException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException(
        error.message
      );
    }
  }
}