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
        getSelectableSubjects: publicProcedure
            .input(z.object({
                departmentCode: z.string()
            }))
            .query(async ({ ctx, input: { departmentCode } }) => {
                return await ctx.db.subject.findMany({
                    where: {
                        departmenId : departmentCode
                    }
                }).then((subjects) => (
                    subjects.map((subject) => ({
                        ...subject,
                        value: subject.code,
                        label: `${subject.code} - ${subject.title}`
                    }))
                ))
            }),
        getSelectableInstructors: publicProcedure
            .input(z.object({
                departmentCode: z.string()
            }))
            .query(async ({ ctx, input: { departmentCode } }) => {
                return await ctx.db.instructor.findMany({
                    where: {
                        departmentCode
                    }
                }).then((instructors) => (
                    instructors.map((instructor) => ({
                        ...instructor,
                        label: `${instructor.employeeID} - ${instructor.firstName} ${instructor.middleName && `${instructor.middleName[0]}. `}${instructor.lastName}`,
                        value : instructor.employeeID
                    }))
                ))
            }),
});
