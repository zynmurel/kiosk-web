import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { format } from "date-fns";

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
    getSection :publicProcedure
    .input(z.object({ id: z.number(), instructorId:z.number() }))
    .query(async ({ input: { id, instructorId }, ctx }) => {
      const dateNow = format(new Date(), "dd/MM/yyyy")
      return await ctx.db.sectionOnSubject.findUnique({
        where: {
          id,
          instructor : {
            instructorId
          }
        },
        include : {
          Attendances : {
            where : {
              date : dateNow
            }
          },
          Batch : {
            include : {
              AttedanceScore : {
                where : {
                  attendance : {
                    date : dateNow
                  }
                }
              },
              student:true
            }
          }
        }
      })
    }),
    createAttendance :publicProcedure
    .input(z.object({ sectionId: z.number() }))
    .mutation(async ({ input: { sectionId }, ctx }) => {
      const dateNow = format(new Date(), "dd/MM/yyyy")
      return await ctx.db.attendance.create({
        data : {
          sectionOnSubjectId : sectionId,
          date : dateNow
        }
      })
    }),
    onCreateAttendanceForStudent : publicProcedure
    .input(z.object({ studentBatchId: z.number(), attendanceId: z.number(), present: z.boolean() }))
    .mutation(async ({ input: { studentBatchId, attendanceId, present }, ctx }) => {
      const findAttendance =await ctx.db.attedanceScore.findFirst({
        where : {
          studentBatchId,
          attendanceId
        }
      })
      return await ctx.db.attedanceScore.upsert({
        where : {
          id : findAttendance?.id || 0
        },
        create : {
          studentBatchId,
          attendanceId,
          present,
        },
        update : {
          present
        }
      })
    }),
    getAttendanceRecord: publicProcedure
    .input(z.object({ 
      from:z.date(),
      to:z.date(),
      sectionOnSubjectId: z.number(),
      instructorId: z.number()
     }))
    .query(async ({ input: { from, to, sectionOnSubjectId, instructorId }, ctx }) => {
      return await ctx.db.studentBatch.findMany({
        where : {
          sectionId : sectionOnSubjectId,
          section : {
            instructor : {
              instructorId
            }
          },
        },
        orderBy :{
          student : {
            lastName : "asc"
          }
        },
        include : {
          student:true,
          section : {
            select : {
              Attendances:{
                orderBy : {
                  createdAt : "asc"
                }
              }
            }
          },
          AttedanceScore : {
            where : {
              attendance : {
                createdAt : {
                  gte:from,
                  lte :to
                }
              },
            },
            include : {
              attendance:true,
              student : true
            },
            orderBy : {
              attendance : {
                createdAt : "asc"
              }
            }
          }
        }
      })
    }),
});
