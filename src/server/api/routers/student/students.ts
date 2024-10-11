import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

// Ensure ActivityTypeEnum is defined correctly
enum ActivityTypeEnum {
  MAJOR_EXAM = "MAJOR_EXAM",
  MAJOR_COURSE_OUTPUT = "MAJOR_COURSE_OUTPUT",
  EXAM = "EXAM",
  QUIZ = "QUIZ",
  ASSIGNMENT = "ASSIGNMENT",
  PROJECT = "PROJECT",
  OTHERS = "OTHERS",
}

export const students_Router = createTRPCRouter({
  getStudentsCourse: publicProcedure
    .input(
      z.object({
        id: z.number().optional(),
        studentId: z.string(),
        semester: z.number(),
        schoolYearLevel: z.number(),
        schoolYear: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.studentBatch.findMany({
        where: {
          studentId: input.id,
          student: {
            studentID: input.studentId,
          },
          section: {
            curriculum: {
              curriculum: {
                semester: input.semester ? input.semester : undefined,
                student_year: input.schoolYearLevel
                  ? input.schoolYearLevel
                  : undefined,
                school_year: input.schoolYear ? input.schoolYear : undefined,
              },
            },
          },
        },
        include: {
          section: {
            include: {
              curriculum: {
                include: {
                  subject: {
                    select: {
                      id: true,
                      code: true,
                      title: true,
                    },
                  },
                },
              },
              instructor: {
                include: {
                  instructor: {
                    select: {
                      firstName: true,
                      lastName: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    }),

  getStudentSection: publicProcedure
    .input(
      z.object({
        id: z.number().optional(),
        ActivityTypeEnum: z
          .enum([
            "ALL",
            "MAJOR_EXAM",
            "MAJOR_COURSE_OUTPUT",
            "EXAM",
            "QUIZ",
            "ASSIGNMENT",
            "PROJECT",
            "OTHERS",
          ])
          .optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const studentData = await ctx.db.studentBatch.findUnique({
        where: {
          id: input.id,
        },
        include: {
          AttedanceScore: {
            include: {
              attendance: true,
            },
          },
          ActivityScores: {
            where: {
              activity: {
                activity_type:
                  input.ActivityTypeEnum === "ALL"
                    ? undefined
                    : input.ActivityTypeEnum,
              },
            },
            include: {
              activity: true,
            },
          },
        },
      });

      const calculateAverage = (activityType: any) => {
        const scores =
          studentData?.ActivityScores.filter(
            (score) => score.activity.activity_type === activityType,
          ) || [];

        const totalScore = scores.reduce((acc, score) => acc + score.score, 0);
        const totalPossibleScore = scores.reduce(
          (acc, score) => acc + score.activity.totalPossibleScore,
          0,
        );

        return totalPossibleScore > 0
          ? (totalScore / totalPossibleScore) * 100
          : 0;
      };

      const calculateAttendancePercentage = () => {
        const attendanceRecords = studentData?.AttedanceScore || [];
        const presentCount = attendanceRecords.filter(
          (record) => record.present,
        ).length;
        const totalAttendanceCount = attendanceRecords.length;

        return totalAttendanceCount > 0
          ? (presentCount / totalAttendanceCount) * 100
          : 0;
      };

      const averageScores = {
        majorExam: calculateAverage("MAJOR_EXAM"),
        majorCourseOutput: calculateAverage("MAJOR_COURSE_OUTPUT"),
        exam: calculateAverage("EXAM"),
        quiz: calculateAverage("QUIZ"),
        assignment: calculateAverage("ASSIGNMENT"),
        project: calculateAverage("PROJECT"),
        others: calculateAverage("OTHERS"),
      };
      const attendancePercentage = calculateAttendancePercentage();

      const overallScores = [
        averageScores.quiz,
        averageScores.assignment,
        averageScores.project,
        averageScores.others,
        attendancePercentage,
      ];

      const totalOverallScore = overallScores.reduce(
        (acc, score) => acc + score,
        0,
      );
      const validScoresCount = overallScores.filter(
        (score) => score > 0,
      ).length;

      const averageOverallScore =
        validScoresCount > 0 ? totalOverallScore / validScoresCount : 0;

      return {
        data: studentData,
        mco: averageScores.majorCourseOutput,
        exam: averageScores.exam,
        classStanding: averageOverallScore,
        attendancePercentage: attendancePercentage,
      };
    }),

  redeemPoints: publicProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        points: z.number(),
        activityType: z.string(),
        activityId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.student.update({
        where: {
          studentID: input.userId,
        },
        data: {
          redeemedPoints: {
            increment: input.points,
          },
        },
      });

      if (input.activityType === "attendance") {
        return await ctx.db.attedanceScore.update({
          where: {
            id: input.activityId,
          },
          data: {
            redeemed: true,
          },
        });
      } else {
        return await ctx.db.activityScores.update({
          where: {
            id: input.activityId,
          },
          data: {
            redeemed: true,
          },
        });
      }
    }),

  getSettingsPoints: publicProcedure.query(({ ctx, input }) => {
    return ctx.db.settings.findFirst({
      select: {
        defaultAttendancePoints: true,
        defaultMCOPoints: true,
        defaultClassStandingPoints: true,
        defaultMajorExamPoints: true,
      },
    });
  }),
  getStudentBusinessTransaction: publicProcedure
    .input(
      z.object({
        studentId: z.number().optional(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.purchasedProduct.findMany({
        where: {
          studentId: input.studentId,
        },
        include: {
          product: {
            include: {
              owner: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
      });
    }),
});
