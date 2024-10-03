import { string, z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

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
});
