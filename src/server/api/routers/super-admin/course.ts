import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const courseRouter = createTRPCRouter({
  getCourseByDepartment : publicProcedure
  .input(z.object({
    departmenCode:z.string().optional()
}))
.query(async({ctx, input : {departmenCode}}) => {
  console.log(departmenCode)
    return !!departmenCode ? await ctx.db.course.findMany({
      where : {
        departmenCode
      }
    }) : null
  }),
  getSelectableDepartment : publicProcedure
  .query(async({ctx}) => {
      return await ctx.db.department.findMany({
      }).then((depts)=>(
          depts.map((dept)=>({
              value : dept.code,
              label : `${dept.code} - ${dept.title}`
          }))
      ))
  }),
});
