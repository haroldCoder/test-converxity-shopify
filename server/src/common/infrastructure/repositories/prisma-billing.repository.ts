import { Injectable } from "@nestjs/common";
import { prisma } from "../database/prisma";

@Injectable()
export class PrismaBillingRepository {

  async create(data: {
    conversionId: string;
    amount: number;
  }) {
    return prisma.billingRecord.create({
      data,
    });
  }

  async findAll() {
    return prisma.billingRecord.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}