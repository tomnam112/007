import type { Prisma } from "@prisma/client";
import prisma from "@/app/lib/prisma";
import { CATEGORIES, STATUSES } from "@/app/lib/validations";

export type ProductQuery = {
  q?: string;
  category?: string;
  status?: string;
  page?: number;
  pageSize?: number;
};

export async function queryProducts(opts: ProductQuery) {
  const pageSize = Math.min(100, Math.max(1, Math.floor(opts.pageSize || 10)));
  const page = Math.max(1, Math.floor(opts.page || 1));

  const where: Prisma.ProductWhereInput = {};

  const q = opts.q?.trim();
  if (q) {
    where.OR = [{ name: { contains: q } }, { description: { contains: q } }];
  }
  if (opts.category && (CATEGORIES as readonly string[]).includes(opts.category)) {
    where.category = opts.category;
  }
  if (opts.status && (STATUSES as readonly string[]).includes(opts.status)) {
    where.status = opts.status;
  }

  const [total, items] = await prisma.$transaction([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}
