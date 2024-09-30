import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const settingsRouter = createTRPCRouter({
    getSettings : publicProcedure
    .query( async ({ctx})=>{
        return await ctx.db.settings.findFirst()
    }),
    updatePoints : publicProcedure
    .input(z.object({
        id:z.number(),
        defaultAttendancePoints: z.number(),
        defaultMajorExamPoints: z.number(),
        defaultMCOPoints: z.number(),
        defaultClassStandingPoints: z.number(),
    }))
    .mutation( async ({ctx, input : {
        id, defaultAttendancePoints, defaultMajorExamPoints,
        defaultMCOPoints,
        defaultClassStandingPoints
    } })=>{
        return await ctx.db.settings.update({
            where : {
                id
            },
            data : {
                defaultAttendancePoints,
                defaultMajorExamPoints,
                defaultMCOPoints,
                defaultClassStandingPoints
            }
        })
    }),
    updatePassword : publicProcedure
    .input(z.object({
        id:z.number(),
        defaultPassword: z.string(),
    }))
    .mutation( async ({ctx, input : {
        id, defaultPassword
    } })=>{
        return await ctx.db.settings.update({
            where : {
                id
            },
            data : {
                defaultPassword,
            }
        })
    }),
    getAccountDetails : publicProcedure
    .input(z.object({
        id:z.number(),
    }))
    .query( async ({ctx, input : {id}})=>{
        return await ctx.db.superAdmin.findUnique({
            where : {
                id
            }
        })
    }),
    updateEmployeeID : publicProcedure
    .input(z.object({
        id:z.number(),
        employeeID: z.string()
    }))
    .mutation( async ({ctx, input : {
        id, employeeID
    } })=>{
        return await ctx.db.superAdmin.update({
            where : {
                id
            },
            data : {
                employeeID:employeeID
            }
        })
    }),
    updateSuperAdminPass : publicProcedure
    .input(z.object({
        id:z.number(),
        password : z.string(),
        newPassword : z.string()
    }))
    .mutation( async ({ctx, input : {
        id, password, newPassword
    } })=>{
        const account = await ctx.db.superAdmin.findFirst({
            where : {
                id,
                password
            }
        })
        if(!account){
            throw new Error("Incorrect Password")
        } else {
            return await ctx.db.superAdmin.update({
                where : {
                    id
                },
                data : {
                    password : newPassword
                }
            })
        }
    }),
});
