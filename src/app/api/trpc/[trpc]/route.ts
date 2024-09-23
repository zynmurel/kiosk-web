import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";
import { SECRET_KEY } from "@/lib/secret";

import { env } from "@/env";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import jwt from 'jsonwebtoken';

export type UserHeaderType ={
  username: string;
  role: string;
  id: number;
  iat: number;
  exp: number;
}

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a HTTP request (e.g. when you make requests from Client Components).
 */
const createContext = async (req: NextRequest) => {
  const token = req.cookies.getAll()[0]?.value
  const decoded = jwt.verify(token||"", SECRET_KEY) as UserHeaderType || undefined
  return createTRPCContext({
    headers: req.headers,
    user : {
      ...decoded,
    }
  });
};

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
            );
          }
        : undefined,
  });

export { handler as GET, handler as POST };
