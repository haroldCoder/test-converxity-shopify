import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";

import { CreateAffiliateUseCase } from "../application/use-cases/create-affiliate.use-case";
import { GetAffiliatesUseCase } from "../application/use-cases/get-affiliate.use-case";
import { DeleteAffiliateUseCase } from "../application/use-cases/delete-affiliate.use-case";

@Controller("api/affiliates")
export class AffiliatesController {
  @Get()
  async findAll(
    @Query("shopId") shopId: string
  ) {
    const useCase =
      new GetAffiliatesUseCase();

    return useCase.execute(shopId);
  }

  @Post()
  async create(
    @Body()
    body: {
      shopId: string;
      name: string;
      code: string;
      commissionPercent: number;
    }
  ) {
    const useCase =
      new CreateAffiliateUseCase();

    return useCase.execute(body);
  }

  @Delete(":id")
  async delete(
    @Param("id") id: string
  ) {
    const useCase =
      new DeleteAffiliateUseCase();

    await useCase.execute(id);

    return {
      message: "Deleted",
    };
  }
}