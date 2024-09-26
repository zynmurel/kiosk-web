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
      subjectType:z.enum(["ALL", "MINOR", "MAJOR"])
    }))
    .query(async ({ ctx, input: { id, school_year, courseCode, subjectType } }) => {
      const whereCourseCode = courseCode === "ALL" ? {} : {courseCode}
      const whereSubjectType = subjectType === "ALL" ? {} : {type : subjectType}
      return await ctx.db.curriculumSubjects.findMany({
        where: {
          InstructorOnSubject : {
            some : {
              instructorId:id
            }
          },
          curriculum: {
            school_year,
            ...whereCourseCode
          },
          subject : {
            ...whereSubjectType
          }
        }
      })
    })
});
