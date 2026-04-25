import {
  Body,
  Controller,
  Post,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";

import { CreateUsageChargeUseCase } from "../application/use-cases";
import {
  ShopifyBillingGateway,
  ShopifyGraphqlClient,
} from "@/common/infrastructure/gateways";
import { ApiResponse } from "@/common/presentation/utils/api-response";
import { CreateUsageChargeDto } from "./dto";
import {
  ShopifyBillingException,
} from "../domain/exceptions";
import { ShopNotFoundException } from "@/modules/shop/domain/exceptions";

@Controller("api/billing")
export class BillingController {
  @Post("usage")
  async create(
    @Body()
    dto: CreateUsageChargeDto
  ): Promise<ApiResponse<{ id: string }>> {
    try {
      const gateway = new ShopifyBillingGateway(
        new ShopifyGraphqlClient(
          dto.shopDomain,
          dto.accessToken
        )
      );
      const useCase = new CreateUsageChargeUseCase(
        gateway
      );

      const id = await useCase.execute({
        shopDomain: dto.shopDomain,
        subscriptionLineItemId:
          dto.subscriptionLineItemId,
        amount: dto.amount,
        description: `Charge for conversion ${dto.conversionId}`,
        conversionId: dto.conversionId,
      });

      return ApiResponse.success(
        "Usage charge created successfully",
        { id }
      );
    } catch (error) {
      if (error instanceof ShopNotFoundException) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof ShopifyBillingException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException(
        error.message
      );
    }
  }
}