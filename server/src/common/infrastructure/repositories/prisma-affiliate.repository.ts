import { AffiliateConvertionEntity } from "@/common/domain/entites";
import { prisma } from "../database/prisma/client";
import { ContainerFactory } from "../di/container";

export class PrismaAffiliateRepository {
  async create(data: {
    shopId: string;
    name: string;
    code: string;
    commissionPercent: number;
  }) {
    return prisma.affiliate.create({
      data,
    });
  }

  async findAll(shopId: string): Promise<AffiliateConvertionEntity[]> {
    const affiliate = await prisma.affiliate.findMany({
      where: { shopId },
      include: {
        conversions: {
          select: {
            affiliateFee: true
          },
        },
      },
    });


    return affiliate.map((affiliate) => {
      return {
        affiliate: affiliate,
        convertion: {
          affiliateFee: affiliate.conversions.reduce((acc, c) => acc + c.affiliateFee, 0),
        },
      };
    });
  }

  async findById(id: string): Promise<AffiliateConvertionEntity> {
    const affiliate = await prisma.affiliate.findUnique({
      where: { id },
    });

    if (!affiliate) {
      throw new Error("Affiliate not found");
    }

    const convertionRepository = ContainerFactory.convertionRepository();
    const convertion = await convertionRepository.findByAffiliateId(id);

    return { // aca podemos crear un mapper para convertir el objeto de prisma a entidad
      affiliate,
      convertion: {
        affiliateFee: convertion?.affiliateFee || 0,
      },
    };
  }

  async findByCode(
    shopId: string,
    code: string
  ) {
    return prisma.affiliate.findFirst({
      where: {
        shopId,
        code,
      },
    });
  }

  async update(
    id: string,
    data: Partial<{
      name: string;
      code: string;
      commissionPercent: number;
      isActive: boolean;
    }>
  ) {
    return prisma.affiliate.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.affiliate.delete({
      where: { id },
    });
  }
}