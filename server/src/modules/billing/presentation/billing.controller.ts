import {
  Body,
  Controller,
  Post,
} from "@nestjs/common";

import { CreateUsageChargeUseCase } from "../application/use-cases";
import { ShopifyBillingGateway, ShopifyGraphqlClient } from "@/common/infrastructure/gateways";

@Controller("api/billing")
export class BillingController {
  @Post("usage")
  async create(
    @Body()
    body: {
      shopDomain: string;
      accessToken: string;
      subscriptionLineItemId: string;
      conversionId: string;
      amount: number;
    }
  ) {
    const gateway = new ShopifyBillingGateway(new ShopifyGraphqlClient(body.shopDomain, body.accessToken));
    const useCase =
      new CreateUsageChargeUseCase(gateway);

    return useCase.execute({
      subscriptionLineItemId: body.shopDomain,
      amount: body.amount,
      description: `Charge for conversion ${body.conversionId}`,
      conversionId: body.conversionId,
    });
  }
}