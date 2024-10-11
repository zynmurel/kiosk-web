import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const shopRouter = createTRPCRouter({
  getAllProductOfBusiness: publicProcedure
    .input(
      z.object({
        searchProduct: z.string().optional(),
        businessId: z.number().optional(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.businnessProduct.findMany({
        where: {
          bussinessId: input.businessId || undefined,
          ...(input.searchProduct && {
            name: {
              contains: input.searchProduct,
              mode: "insensitive",
            },
          }),
        },
        include: {
          owner: {
            select: {
              title: true,
            },
          },
          _count: {
            select: {
              PurchasedProduct: true,
            },
          },
        },
        orderBy: {
          PurchasedProduct: {
            _count: "desc",
          },
        },
      });
    }),

  buyProuductByPoints: publicProcedure
    .input(
      z.object({
        productId: z.number(),
        studentId: z.number(),
        cost: z.number(),
        quantity: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const student = await ctx.db.student.findFirst({
        where: {
          id: input.studentId,
        },
        select: {
          redeemedPoints: true,
        },
      });

      if (!student) {
        throw new Error("Student not found");
      }

      if (student.redeemedPoints < input.cost) {
        throw new Error("Not enough points");
      }

      await ctx.db.purchasedProduct.create({
        data: {
          studentId: input.studentId,
          productId: input.productId,
          purchase_status: "PURCHASED",
          quantity: input.quantity,
        },
      });

      return ctx.db.student.update({
        where: {
          id: input.studentId,
        },
        data: {
          redeemedPoints: {
            decrement: input.cost,
          },
        },
      });
    }),
});
