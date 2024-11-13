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
          curriculum:{
            include:{
              subject:true,
              curriculum:true
            }
          },
          Activities:true,
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
    updateGradingTerm :publicProcedure
    .input(z.object({ sectionId: z.number(), grading_term:z.enum(["MIDTERM", "FINAL_TERM"]) }))
    .mutation(async ({ input: { sectionId, grading_term }, ctx }) => {
      return await ctx.db.sectionOnSubject.update({
        where : {
          id : sectionId,
        },
        data:{
          grading_term
        }
      })

    }),
    createAttendance :publicProcedure
    .input(z.object({ sectionId: z.number(), grading_term:z.enum(["MIDTERM", "FINAL_TERM"]) }))
    .mutation(async ({ input: { sectionId, grading_term }, ctx }) => {
      const dateNow = format(new Date(), "dd/MM/yyyy")
      return await ctx.db.attendance.create({
        data : {
          sectionOnSubjectId : sectionId,
          date : dateNow,
          grading_term : grading_term
        },
        include : {
          section : {
            select : {
              Batch : { 
                select : {
                  id : true
                }
              }
            }
          }
        }
      }).then(async(attendance)=> {
        await ctx.db.attedanceScore.createMany({
          data : attendance.section.Batch.map((student)=>({
            studentBatchId : student.id,
            attendanceId : attendance.id,
            present : false,
          }))
        })
        return attendance
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
        },
        include : {
          student : {
            select : {
              studentId:true
            }
          }
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
    getInstructorsSections: publicProcedure
    .input(z.object({
      id: z.number(),
      school_year: z.string(),
      courseCode: z.string(),
      semester:z.number()
    }))
    .query(async ({ ctx, input: { id, school_year, courseCode, semester } }) => {
      const whereCourseCode = courseCode === "All" ? {} : {courseCode}
      const whereSemester = semester === 0 ? {} : { semester }
      return await ctx.db.sectionOnSubject.findMany({
        where: {
          curriculum : {
            curriculum : {
              school_year,
              ...whereCourseCode,
              ...whereSemester
            }
          },
          instructor : {
            instructorId:id
          }
        },
        include : {
          curriculum : {
            select : {
              curriculum : true,
              subject : {
                include:{
                  gradingSystem:true
                }
              }
            }
          },
        }
      })
    }),
    createActivity :publicProcedure
    .input(z.object({ 
      sectionId: z.number(),
      title: z.string(),
      description : z.string().optional(),
      settedRedeemablePoints : z.number().optional(),
      totalPossibleScore : z.number(),
      grading_term:z.enum(["MIDTERM", "FINAL_TERM"]) ,
      activity_type : z.enum(["MAJOR_EXAM" , "MAJOR_COURSE_OUTPUT" , "EXAM" , "QUIZ" , "ASSIGNMENT" , "PROJECT" , "OTHERS"])
    }))
    .mutation(async ({ input: { sectionId, title,grading_term, description, settedRedeemablePoints, totalPossibleScore,activity_type }, ctx }) => {
      return await ctx.db.activity.create({
        data : {
          sectionOnSubjectId : sectionId,
          title,
          description,
          settedRedeemablePoints,
          totalPossibleScore,
          activity_type,
          grading_term
        },
        include : {
          section : {
            select : {
              Batch : { 
                select : {
                  id : true
                }
              }
            }
          }
        }
      }).then(async(activity)=> {
        await ctx.db.activityScores.createMany({
          data : activity.section.Batch.map((student)=>({
            studentBatchId : student.id,
            activityId : activity.id,
            score : 0,
          }))
        })
        return activity
      })

    }),
    getActivities : publicProcedure
    .input(z.object({ 
      sectionId: z.number(),
    }))
    .query(async ({ input: { sectionId }, ctx }) => {
      return await ctx.db.activity.findMany({
        where : {
          sectionOnSubjectId : sectionId,
        },
        orderBy : {
          createdAt : "desc"
        }
      })

    }),
    getActivity : publicProcedure
    .input(z.object({ 
      activityId: z.number(),
    }))
    .query(async ({ input: { activityId }, ctx }) => {
      return await ctx.db.activity.findUnique({
        where : {
          id : activityId,
        },
        include : {
          ActivityScores : {
            include : {
              student : {
                include : {
                  student : true
                }
              }
            },
            orderBy : {
              student : {
                student : {
                  lastName : "asc"
                }
              }
            }
          }
        }
      })

    }),
    updateActivityScore :publicProcedure
    .input(z.object({ 
      activityScoreId: z.number(),
      score: z.number(),
    }))
    .mutation(async ({ input: { activityScoreId, score }, ctx }) => {
      return await ctx.db.activityScores.update({
        where : {
          id:activityScoreId
        },
        data : {
          score
        }
      })

    }),

});
