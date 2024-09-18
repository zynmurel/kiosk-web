import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const adminCourseRouter = createTRPCRouter({
    getCourse: publicProcedure
        .input(z.object({
            code: z.string(),
            departmenCode: z.string(),
        }))
        .query(async ({ ctx, input: { code, departmenCode } }) => {
            const course = await ctx.db.course.findUnique({
                where: {
                    code,
                    departmenCode
                },
                include: {
                    _count: {
                        select: {
                            Student: true,
                            Curriculum: true
                        }
                    }
                }
            })
            if (!!course) {
                return course
            } else {
                throw new Error("No Department found")
            }
        }),
    upsertCourse: publicProcedure
        .input(z.object({
            id: z.string().optional(),
            departmenCode: z.string(),
            code: z.string(),
            title: z.string(),
        }))
        .mutation(({ ctx, input: {
            title, code, departmenCode, id
        } }) => {
            const data = { title, code, departmenCode }
            return ctx.db.course.upsert({
                where: {
                    code: id || "",
                    departmenCode
                },
                create: {
                    ...data,
                    code: data.code.toUpperCase()
                },
                update: {
                    ...data,
                    code: data.code.toUpperCase()
                }
            })
        }),
    getCourseByDepartment: publicProcedure
        .input(z.object({
            departmenCode: z.string()
        }))
        .query(async ({ ctx, input: { departmenCode } }) => {
            return await ctx.db.course.findMany({
                where: {
                    departmenCode
                },
                orderBy: {
                    createdAt: "desc"
                }
            })
        }),
    deleteCourse: publicProcedure
        .input(z.object({
            code: z.string(),
        }))
        .mutation(({ ctx, input: { code } }) => {
            return ctx.db.course.delete({
                where: {
                    code
                },
            })
        }),
});
