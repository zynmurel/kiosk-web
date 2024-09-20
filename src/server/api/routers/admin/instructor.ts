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
        .mutation(async ({ ctx, input : {
            id
        } }) => {
            const settings = await ctx.db.settings.findFirst()
            if(settings){
              return await ctx.db.student.update({
                  where : {
                      id : id
                  },
                  data : {
                    password : settings.defaultPassword
                  }
              })
            }else {
              throw new Error("No Settings Found.")
            }
        }),
});
