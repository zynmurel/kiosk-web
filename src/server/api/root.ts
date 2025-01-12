import { postRouter } from "@/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { departmentRouter } from "./routers/super-admin/department";
import { adminRouter } from "./routers/super-admin/admin";
import { courseRouter } from "./routers/super-admin/course";
import { settingsRouter } from "./routers/super-admin/settings";
import { adminCourseRouter } from "./routers/admin/course";
import { adminSubjectRouter } from "./routers/admin/subject";
import { adminStudentRouter } from "./routers/admin/student";
import { adminInstructorRouter } from "./routers/admin/instructor";
import { adminGlobalRouter } from "./routers/admin/global";
import { businessProductsRouter } from "./routers/company/products";
import { adminCurriculumRouter } from "./routers/admin/curriculum";
import { adminAccountRouter } from "./routers/admin/account";
import { instructorSubjectsRouter } from "./routers/instructor/subjects";
import { instructorGlobalRouter } from "./routers/instructor/global";
import { instructorSectionRouter } from "./routers/instructor/section";
import { studentPointsRouter } from "./routers/student/points";
import { students_Router } from "./routers/student/students";
import { shopRouter } from "./routers/shop/shop_product";
import { instructorAccountRouter } from "./routers/instructor/account";
import { companiesRouter } from "./routers/super-admin/company";
import { adminSettingRouter } from "./routers/admin/settings";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */

export const appRouter = createTRPCRouter({
  super: {
    department: departmentRouter,
    admin: adminRouter,
    course: courseRouter,
    settings: settingsRouter,
    company:companiesRouter
  },
  admin: {
    global: adminGlobalRouter,
    course: adminCourseRouter,
    subject: adminSubjectRouter,
    student: adminStudentRouter,
    instructor: adminInstructorRouter,
    curriculum: adminCurriculumRouter,
    account: adminAccountRouter,
    settings : adminSettingRouter
  },
  instructor: {
    global: instructorGlobalRouter,
    subject: instructorSubjectsRouter,
    section: instructorSectionRouter,
    account: instructorAccountRouter,
  },

  student: {
    points: studentPointsRouter,
    students: students_Router,
  },
  business: {
    product: businessProductsRouter,
  },

  shop: {
    product: shopRouter,
  },
  post: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
