import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const adapter = new PrismaLibSql({
  url: `${process.env.DATABASE_URL}`,
});

export const prisma =
  global.prisma ??
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}