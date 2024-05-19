import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import { Context } from "hono";

export function contextPrisma(
  c: Context<{
    Bindings: Bindings;
  }>
) {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });
  return prisma;
}
