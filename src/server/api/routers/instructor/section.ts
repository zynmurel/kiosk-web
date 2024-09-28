import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const instructorSectionRouter = createTRPCRouter({
  getInstructorOnSubject: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input: { id }, ctx }) => {
      return await ctx.db.instructorOnSubject.findUnique({
        where: {
          id
        },
        include: {
          CurriculumSubjects: {
            include: {
              subject: true,
              curriculum: {
                include: {
                  course: true
                }
              }
            }
          }
        }
      })
    }),
  getAvailableStudents: publicProcedure.input(z.object({ courseCode: z.string() }))
    .query(async ({ input: { courseCode }, ctx }) => {
      return await ctx.db.student.findMany({
        where: {
          courseCode
        },
      }).then((data) => {
        return data.map((student) => ({
          id: student.id,
          name: `${student.lastName}, ${student.firstName} ${student.middleName ? (student.middleName[0] + ".") : ""} `,
          studentID: student.studentID
        }))
      })
    }),
  createSection: publicProcedure.input(z.object({
    section_name: z.string(),
    instructorId: z.number(),
    curriculumSubjectId: z.number(),
    studentIDs: z.array(z.object({
      studentId: z.number()
    }))
  }))
    .mutation(async ({ input: { section_name, studentIDs, instructorId, curriculumSubjectId }, ctx }) => {
      return await ctx.db.sectionOnSubject.create({
        data: {
          section_name,
          instructorId,
          curriculumSubjectId,
          Batch: {
            createMany: {
              data: studentIDs
            }
          }
        },
        include : {
          curriculum : {
            include : {
              subject:true,
              curriculum : true
            }
          }
        }
      })
    }),
});
