import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from "@nestjs/common";

import { CreateAffiliateUseCase } from "../application/use-cases/create-affiliate.use-case";
import { GetAffiliatesUseCase } from "../application/use-cases/get-affiliate.use-case";
import { DeleteAffiliateUseCase } from "../application/use-cases/delete-affiliate.use-case";

import { CreateAffiliateDto } from "./dto/create-affiliate.dto";
import { AffiliateResponseDto } from "./dto/affiliate-response.dto";
import { AffiliateNotFoundException } from "../domain/exceptions/affiliate-not-found.exception";
import { AffiliateAlreadyExistsException } from "../domain/exceptions/affiliate-already-exists.exception";
import { ShopNotFoundException } from "../domain/exceptions/shop-not-found.exception";
import { ApiResponse } from "@/common/presentation/utils/api-response";



@Controller("api/affiliates")
export class AffiliatesController {
  @Get()
  async findAll(
    @Query("shopId") shopId: string
  ): Promise<ApiResponse<AffiliateResponseDto[]>> {
    try {
      const useCase = new GetAffiliatesUseCase();
      const affiliates = await useCase.execute(shopId);

      const data = affiliates.map(
        (a) =>
          new AffiliateResponseDto({
            ...a,
            createdAt: a.createdAt?.toISOString(),
            updatedAt: a.updatedAt?.toISOString(),
          })
      );

      return ApiResponse.success(
        "Affiliates retrieved successfully",
        data
      );
    } catch (error) {
      throw new InternalServerErrorException(
        error.message
      );
    }
  }

  @Post()
  async create(
    @Body()
    createAffiliateDto: CreateAffiliateDto
  ): Promise<ApiResponse<{ id: string }>> {
    try {
      const useCase = new CreateAffiliateUseCase();
      const id = await useCase.execute(
        createAffiliateDto
      );

      return ApiResponse.success(
        "affiliate created successfully",
        { id }
      );
    } catch (error) {
      if (
        error instanceof
        AffiliateAlreadyExistsException
      ) {
        throw new ConflictException(error.message);
      }
      if (error instanceof ShopNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(
        error.message
      );

    }
  }

  @Delete(":id")
  async delete(
    @Param("id") id: string
  ): Promise<ApiResponse<AffiliateResponseDto>> {
    try {
      const useCase = new DeleteAffiliateUseCase();
      const deleted = await useCase.execute(id);

      const data = new AffiliateResponseDto({
        ...deleted,
        createdAt: deleted.createdAt?.toISOString(),
        updatedAt: deleted.updatedAt?.toISOString(),
      });

      return ApiResponse.success(
        "Affiliate deleted successfully",
        data
      );
    } catch (error) {
      if (
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