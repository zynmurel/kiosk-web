import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const departmentRouter = createTRPCRouter({
  upsertDepartment: publicProcedure
    .input(z.object({
        id: z.number().optional(),
        code: z.string(),
        title: z.string(),
        description: z.string()
    }))
    .mutation(({ ctx, input : {
        id, title, code, description
    } }) => {
        const data = { title, code, description }
        return ctx.db.department.upsert({
            where : {
                id : id || 0
            },
            create : {
                ...data,
                code:data.code.toUpperCase()
            },
            update : {
                ...data,
                code:data.code.toUpperCase()
            }
        })
    }),
    getAllDepartments : publicProcedure
    .query(({ctx}) => {
        return ctx.db.department.findMany({
            orderBy : {
                code : "asc"
            },
            select : {
                id : true,
                code : true,
                title : true,
            }
        })
    }),
    getDepartment : publicProcedure
    .input(z.object({
        id:z.number()
    }))
    .query(async({ctx, input : {id}}) => {
        const department = await ctx.db.department.findUnique({
            where : {
                id
            },
            include : {
                Admin : true,
                _count : {
                    select : {
                        Instructor : true,
                        Subject : true,
                        Course : true,
                    }
                }
            }
        })
        if(!!department){
            const dean = department.Admin[0]
            const admin = !!dean ? `${dean.fullName}`: null
            return {
                id:department.id,
                code:department.code,
                title:department.title,
                description:department.description,
                admin,
                counts : {
                    ...department._count
                }
            }
        }else{
            throw new Error("No Department found")
        }
    })
});
