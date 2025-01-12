import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const adminSettingRouter = createTRPCRouter({
    getDepartment : publicProcedure
    .input(z.object({
        code:z.string(),
    }))
    .query( async ({ctx, input:{code}})=>{
        return await ctx.db.department.findUnique({
            where:{
                code
            },
        })
    }),
    updateGradeBase : publicProcedure
    .input(z.object({
        code:z.string(),
        gradeBase: z.number(),
    }))
    .mutation( async ({ctx, input : {
        code,
        gradeBase
    } })=>{
        console.log(code, gradeBase)
        return await ctx.db.department.update({
            where : {
                code
            },
            data : {
                gradeBases:gradeBase
            }
        })
    }),
});
