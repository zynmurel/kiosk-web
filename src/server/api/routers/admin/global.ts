import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const adminGlobalRouter = createTRPCRouter({
    getSelectableCourse: publicProcedure
        .input(z.object({
            departmenCode: z.string()
        }))
        .query(async ({ ctx, input: { departmenCode } }) => {
            return await ctx.db.course.findMany({
                where: {
                    departmenCode
                }
            }).then((courses) => (
                courses.map((course) => ({
                    value: course.code,
                    label: `${course.code} - ${course.title}`
                }))
            ))
        }),
});
