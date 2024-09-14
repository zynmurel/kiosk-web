import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const adminRouter = createTRPCRouter({
    getAllDeans : publicProcedure
    .query(async({ctx})=>{
        return await ctx.db.admin.findMany({
            include : {
                department : true
            }
        }).then((admins)=>(
            admins.map((admin)=>({
                id:admin.id,
                employeeID:admin.employeeID,
                name : admin.fullName,
                dept_code : admin.department.code,
            }))
        ))
    }),
    getDean: publicProcedure
    .input(z.object({
        id:z.number()
    }))
    .query(async({ctx, input : {id}}) => {
        return await ctx.db.admin.findUnique({
            where : {
                id
            }
        })
    }),
    getSelectableDepartment : publicProcedure
    .input(z.object({
        id:z.number().optional()
    }))
    .query(async({ctx, input:{id}}) => {
        const whereDept = id ? {
                    Admin : {
                        some : {
                            id
                        }
                    }
                } : {}
        return await ctx.db.department.findMany({
            where : {
                OR : [{Admin : {
                    none : {}
                }}, { ...whereDept}]
            }
        }).then((depts)=>(
            depts.map((dept)=>({
                value : dept.code,
                label : `${dept.code} - ${dept.title}`
            }))
        ))
    }),
    upsertDean: publicProcedure
      .input(z.object({
        id: z.number().optional(),
        fullName: z.string(),
        departmentCode: z.string(),
        contact: z.string().optional(),
        email: z.string().optional(),
        employeeID: z.string(),
      }))
      .mutation(async ({ ctx, input : {
          id, fullName, departmentCode, contact, email, employeeID
      } }) => {
          const data = { fullName, departmentCode, contact, email, employeeID }
          const settings = await ctx.db.settings.findFirst()
          if(settings){
            return await ctx.db.admin.upsert({
                where : {
                    id : id || 0
                },
                create : {
                    ...data,
                    password : settings.defaultPassword
                },
                update : {
                    ...data,
                }
            })
          }else {
            throw new Error("No Settings Found.")
          }
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
              return await ctx.db.admin.update({
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
