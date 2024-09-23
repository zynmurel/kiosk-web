import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const businessProductsRouter = createTRPCRouter({
  getAllProductOfBusiness: publicProcedure
    .input(
      z.object({
        businessId: z.number(),
        searchProduct: z.string().optional(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.businnessProduct.findMany({
        where: {
          bussinessId: input.businessId,
        },
        include: {
          owner: {
            select: {
              title: true,
            },
          },
        },
      });
    }),

  addProduct: publicProcedure
    .input(
      z.object({
        productId: z.number().optional(),
        bussinessId: z.number(),
        name: z.string(),
        imageUrl: z.string(),
        cost: z.number(),
        description: z.string(),
        quantity: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { productId, ...createData } = input;

      if (productId) {
        return ctx.db.businnessProduct.update({
          where: { id: productId },
          data: { ...createData },
        });
      } else {
        return ctx.db.businnessProduct.create({
          data: createData,
        });
      }
    }),
  deleteProduct: publicProcedure
    .input(
      z.object({
        productId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.businnessProduct.delete({
        where: {
          id: input.productId,
        },
      });
    }),

  AuthSessionCompany: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.businness.findUnique({
        where: {
          username: input.username,
        },
      });
    }),
});
