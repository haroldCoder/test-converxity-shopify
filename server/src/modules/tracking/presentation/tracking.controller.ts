import {
  Body,
  Controller,
  Post,
} from "@nestjs/common";

import { RegisterConversionUseCase } from "../application/use-cases";

@Controller("api/tracking")
export class TrackingController {
  @Post("conversion")
  async register(
    @Body()
    body: {
      shopId: string;
      affiliateCode: string;
      orderId: string;
      total: number;
    }
  ) {
    const useCase =
      new RegisterConversionUseCase();

    return useCase.execute(body);
  }
}