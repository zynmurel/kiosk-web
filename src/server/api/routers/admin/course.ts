import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const adminCourseRouter = createTRPCRouter({
  getCourse : publicProcedure
  .input(z.object({
      code:z.string()
  }))
  .query(async({ctx, input : {code}}) => {
      const course = await ctx.db.course.findUnique({
          where : {
              code
          },
          include : {
            _count : {
                select : {
                    Student :true,
                    Curriculum : true
                }
            }
          }
      })
      if(!!course){
        return course
      }else{
          throw new Error("No Department found")
      }
  }),
  upsertCourse: publicProcedure
    .input(z.object({
        id:z.string().optional(),
        departmenCode: z.string(),
        code: z.string(),
        title: z.string(),
    }))
    .mutation(({ ctx, input : {
        title, code, departmenCode, id
    } }) => {
        const data = { title, code, departmenCode }
        return ctx.db.course.upsert({
            where : {
                code : id || ""
            },
            create : {
                ...data,
                code:data.code.toUpperCase()
            },
            update : {
                ...data,
                code:data.code.toUpperCase()
            }
        })
    }),
    getCourseByDepartment : publicProcedure
    .input(z.object({
      departmenCode:z.string().optional()
  }))
  .query(async({ctx, input : {departmenCode}}) => {
      return !!departmenCode ? await ctx.db.course.findMany({
        where : {
          departmenCode
        },
        orderBy : {
          createdAt:"desc"
        }
      }) : null
    }),
    deleteCourse: publicProcedure
      .input(z.object({
          code: z.string(),
      }))
      .mutation(({ ctx, input : { code } }) => {
          return ctx.db.course.delete({
              where : {
                  code
              },
          })
      }),
});
