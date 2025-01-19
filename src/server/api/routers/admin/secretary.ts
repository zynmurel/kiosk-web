import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const adminSecretaryRouter = createTRPCRouter({
  getSecretariesInDepartment: publicProcedure
    .input(z.object({
      departmentCode: z.string(),
    }))
    .query(async ({ ctx, input: { departmentCode } }) => {
      return await ctx.db.admin.findMany({
        where: {
          departmentCode,
          is_secretary:true
        },
        orderBy: {
          createdAt: "desc"
        }
      })
    }),
  resetPassword: publicProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ ctx, input: {
      id
    } }) => {
      const settings = await ctx.db.settings.findFirst()
      if (settings) {
        return await ctx.db.instructor.update({
          where: {
            id: id
          },
          data: {
            password: settings.defaultPassword
          }
        })
      } else {
        throw new Error("No Settings Found.")
      }
    }),
  upsertSecretary: publicProcedure
    .input(z.object({
      id: z.number().optional(),
      employeeID: z.string(),
      fullName: z.string(),
      contact: z.string().optional(),
      email: z.string().optional(),
      departmentCode: z.string(),
    }))
    .mutation(async ({ ctx, input: {
      employeeID, fullName, contact, email, id, departmentCode
    } }) => {
      const data = { employeeID, fullName, contact, email, departmentCode }
      const settings = await ctx.db.settings.findFirst()
      if (settings) {
        return await ctx.db.admin.upsert({
          where: {
            id: id || 0,
            is_secretary:true
          },
          create: {
            ...data,
            is_secretary:true,
            password: settings.defaultPassword
          },
          update: {
            ...data,
            password: settings.defaultPassword
          }
        })
      } else {
        throw new Error("No Settings Found.")
      }
    }),
});
