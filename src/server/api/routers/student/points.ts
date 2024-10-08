import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const studentPointsRouter = createTRPCRouter({
  getTotalPointsOfStudents: publicProcedure
    .input(
      z.object({
        studentId: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.student.findFirst({
        where: {
          studentID: input.studentId,
        },
        select: {
          redeemedPoints: true,
        },
      });
    }),
});
