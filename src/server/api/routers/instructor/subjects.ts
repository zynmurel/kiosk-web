import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const instructorSubjectsRouter = createTRPCRouter({
  getSelectableCourseCode :publicProcedure
  .input(z.object({
    id: z.number(),
  }))
  .query(async({ ctx, input: { id } }) => {
    return await ctx.db.curriculum.findMany({
      distinct : ['courseCode'],
      where: {
        CurriculumSubjects : {
          some : {
            InstructorOnSubject : {
              some : {
                instructorId:id
              }
            }
          }
        }
      },
    }).then((data)=>{
      return data.map((curriculum)=>({
        courseCode:curriculum.courseCode
      }))
    })
  }),
  getInstructorsSubjects: publicProcedure
    .input(z.object({
      id: z.number(),
      school_year: z.string(),
      courseCode: z.string(),
      semester:z.number()
    }))
    .query(async ({ ctx, input: { id, school_year, courseCode, semester } }) => {
      const whereCourseCode = courseCode === "All" ? {} : {courseCode}
      const whereSemester = semester === 0 ? {} : { semester }
      return await ctx.db.curriculumSubjects.findMany({
        distinct:["subjectId"],
        where: {
          InstructorOnSubject : {
            some : {
              instructorId:id
            }
          },
          curriculum: {
            school_year,
            ...whereCourseCode,
            ...whereSemester
          },
        },
        include : {
          subject : {
            select : {
              code : true,
              title : true,
              type : true
            }
          },
          InstructorOnSubject:{
            where : {
              instructorId:id
            },
            select : {
              id : true
            }
          }
        }
      })
    }),
    getInstructorsSubject: publicProcedure
    .input(z.object({
      subjectCode: z.string(),
      instructorId: z.number(),
    }))
    .query(async ({ ctx, input: { subjectCode, instructorId } }) => {
      return await ctx.db.sectionOnSubject.findMany({
        where : {
          instructor : {
            instructorId
          },
          curriculum : {
            subject : {
              code : subjectCode
            }
          }
        },
        include : {
          curriculum : {
            select : {
              curriculum : true,
              subject : true
            }
          }
        }
      })
    }),
});
