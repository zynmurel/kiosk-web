import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const adminInstructorRouter = createTRPCRouter({
  getInstructorsInDepartment: publicProcedure
    .input(z.object({
      departmentCode: z.string(),
    }))
    .query(async ({ ctx, input: { departmentCode } }) => {
      return await ctx.db.instructor.findMany({
        where: {
          departmentCode
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
  upsertInstructor: publicProcedure
    .input(z.object({
      id: z.number().optional(),
      employeeID: z.string(),
      firstName: z.string(),
      middleName: z.string(),
      lastName: z.string(),
      contact: z.string().optional(),
      email: z.string().optional(),
      departmentCode: z.string(),
    }))
    .mutation(async ({ ctx, input: {
      employeeID, firstName, middleName, lastName, contact, email, id, departmentCode
    } }) => {
      const data = { employeeID, firstName, middleName, lastName, contact, email, departmentCode }
      const settings = await ctx.db.settings.findFirst()
      if (settings) {
        return await ctx.db.instructor.upsert({
          where: {
            id: id || 0,
          },
          create: {
            ...data,
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
