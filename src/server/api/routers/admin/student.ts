import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const adminStudentRouter = createTRPCRouter({
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
    upsertStudent: publicProcedure
        .input(z.object({
            id: z.number().optional(),
            courseCode: z.string(),
            studentID: z.string(),
            firstName: z.string(),
            middleName: z.string(),
            lastName: z.string(),
            contact: z.string().optional(),
            email: z.string().optional(),
            departmentCode: z.string(),
        }))
        .mutation(async ({ ctx, input: {
            courseCode, studentID, firstName, middleName, lastName, contact, email, id, departmentCode
        } }) => {
            const data = { courseCode, studentID, firstName, middleName, lastName, contact, email, departmentCode }
            const settings = await ctx.db.settings.findFirst()
            if (settings) {
                return await ctx.db.student.upsert({
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
    getStudentByCourse: publicProcedure
        .input(z.object({
            courseCode: z.string(),
            departmentCode: z.string(),
        }))
        .query(async ({ ctx, input: { courseCode, departmentCode } }) => {
            const whereCourse = courseCode === "ALL" ? {} : {courseCode}
            return await ctx.db.student.findMany({
                where: {
                    ...whereCourse,
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
