import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const companiesRouter = createTRPCRouter({
    getAllCompanies : publicProcedure
    .query(async({ctx})=>{
        return await ctx.db.businness.findMany({
        })
    }),
    getCompany: publicProcedure
    .input(z.object({
        id:z.number()
    }))
    .query(async({ctx, input : {id}}) => {
        return await ctx.db.businness.findUnique({
            where : {
                id
            }
        })
    }),
    upsertCompany: publicProcedure
      .input(z.object({
        id: z.number().optional(),
        title     :       z.string(),
        description  :    z.string(),
        username    :    z.string(),
        contact         : z.string().optional(),
        email           : z.string().optional(),
      }))
      .mutation(async ({ ctx, input : {
          id, title, description, username, contact, email
      } }) => {
          const data = { title, description, username, contact, email }
          const settings = await ctx.db.settings.findFirst()
          if(settings){
            return await ctx.db.businness.upsert({
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
              return await ctx.db.businness.update({
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
