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
});
