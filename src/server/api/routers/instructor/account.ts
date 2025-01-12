import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const instructorAccountRouter = createTRPCRouter({
    getAccountDetails : publicProcedure
    .input(z.object({
        id:z.number(),
    }))
    .query( async ({ctx, input : {id}})=>{
        return await ctx.db.instructor.findUnique({
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
        return await ctx.db.instructor.update({
            where : {
                id
            },
            data : {
                employeeID:employeeID
            }
        })
    }),
    updateInstructorPass : publicProcedure
    .input(z.object({
        id:z.number(),
        password : z.string(),
        newPassword : z.string()
    }))
    .mutation( async ({ctx, input : {
        id, password, newPassword
    } })=>{
        const account = await ctx.db.instructor.findUnique({
            where : {
                id,
                password
            }
        })
        if(!account){
            throw new Error("Incorrect Password")
        } else {
            return await ctx.db.instructor.update({
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
