import {
  Body,
  Controller,
  Post,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";

import { RegisterConversionUseCase } from "../application/use-cases";
import { ApiResponse } from "@/common/presentation/utils/api-response";
import {
  RegisterConversionDto,
  ConversionResponseDto,
} from "./dto";
import { ShopNotFoundException } from "@/modules/shop/domain/exceptions";
import { AffiliateNotFoundException } from "@/modules/affiliates/domain/exceptions";

@Controller("api/tracking")
export class TrackingController {
  constructor(
    private readonly registerConversionUseCase: RegisterConversionUseCase
  ) { }

  @Post("conversion")
  async register(
    @Body()
    dto: RegisterConversionDto
  ): Promise<ApiResponse<ConversionResponseDto>> {
    try {
      const result = await this.registerConversionUseCase.execute(dto);

      const data = new ConversionResponseDto({
        id: result.id,
        orderId: result.orderId,
        total: result.total,
        appFee: result.appFee,
        affiliateFee: result.affiliateFee,
        createdAt: result.createdAt.toISOString(),
      });

      return ApiResponse.success(
        "Conversion registered successfully",
        data
      );
    } catch (error) {
      if (
        error instanceof ShopNotFoundException ||
        error instanceof AffiliateNotFoundException
      ) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(
        error.message
      );
    }
  }
}