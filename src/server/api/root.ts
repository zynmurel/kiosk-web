import { postRouter } from "@/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { departmentRouter } from "./routers/super-admin/department";
import { adminRouter } from "./routers/super-admin/admin";
import { courseRouter } from "./routers/super-admin/course";
import { settingsRouter } from "./routers/super-admin/settings";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */


export const appRouter = createTRPCRouter({
  super : {
    department : departmentRouter,
    admin : adminRouter,
    course : courseRouter,
    settings : settingsRouter
  },
  admin : {

  },
  instructor : {

  },
  student : {

  },
  business : {

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
