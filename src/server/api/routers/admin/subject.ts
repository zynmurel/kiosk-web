import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const adminSubjectRouter = createTRPCRouter({
    getSubject: publicProcedure
        .input(z.object({
            id: z.number(),
            departmenId : z.string(),
        }))
        .query(async ({ ctx, input: { id, departmenId } }) => {
            const subject = await ctx.db.subject.findUnique({
                where: {
                    id,
                    departmenId
                },
                include: {
                    _count: {
                        select: {
                            CurriculumSubjects : true
                        }
                    }
                }
            })
            if (!!subject) {
                return subject
            } else {
                throw new Error("No Subject found")
            }
        }),
    upsertSubject: publicProcedure
        .input(z.object({
            id: z.number().optional(),
            departmenId: z.string(),
            code: z.string(),
            category:z.string(),
            title: z.string(),
            description: z.string(),
            units: z.number(),
            type: z.enum(["MINOR", "MAJOR"]),
            grading_system: z.enum(["ZERO_BASED", "TRANSMUTED"]),
        }))
        .mutation(async({ ctx, input: {
            title, code, departmenId, id, type, description, units, category, grading_system
        } }) => {
            const data = { title, code, departmenId, type, description, units, grading_system  }
            return await ctx.db.subject.upsert({
                where: {
                    id: id || 0,
                    // departmenId
                },
                create: {
                    ...data,
                    gradingSystemCategory:category,
                    code: data.code.toUpperCase()
                },
                update: {
                    ...data,
                    gradingSystemCategory:category,
                    code: data.code.toUpperCase()
                }
            })
        }),
    getSubjectsByType: publicProcedure
        .input(z.object({
            departmenCode: z.string().optional(),
            type: z.enum(["ALL", "MINOR", "MAJOR"])
        }))
        .query(async ({ ctx, input: { departmenCode, type } }) => {
            const whereType = type === "ALL" ? {} : { type }
            return !!departmenCode ? await ctx.db.subject.findMany({
                where: {
                    departmenId: departmenCode,
                    ...whereType
                },
                orderBy: {
                    createdAt: "desc"
                }
            }) : null
        }),
    deleteSubject: publicProcedure
        .input(z.object({
            id: z.number(),
        }))
        .mutation(({ ctx, input: { id } }) => {
            return ctx.db.subject.delete({
                where: {
                    id
                },
            })
        }),
});
