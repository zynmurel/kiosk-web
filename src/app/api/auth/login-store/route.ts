import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { type CredentialsType } from "@/lib/types/login";
import { createSessionToken } from "@/lib/session";
import { cookieVariables } from "@/lib/api-helper/cookie-variables";

export async function POST(req: NextRequest) {
  const { username, password, role } = await req.json().then((data) => {
    return { ...data } as CredentialsType;
  });

  if (!username || !password) {
    return NextResponse.json(
      { error: "Missing Required Fields" },
      { status: 400 },
    );
  }

  try {
    if (role === "business") {
      const business = await db.businness.findUnique({
        where: { username: username },
      });

      if (!business) {
        return NextResponse.json(
          { error: "business credentials  not found." },
          { status: 401 },
        );
      }
      const passwordMatch = password === business.password;

      if (!passwordMatch) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 },
        );
      }
      const sessionToken = createSessionToken({
        username,
        password,
        role,
        id: business.id,
      });
      const response = NextResponse.json(
        {
          message: "Login successful",
          user: { username, role, business_username: business.id },
        },
        { status: 200 },
      );
      response.cookies.set(cookieVariables.business, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/login-store",
      });
      return response;
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error logging in" }, { status: 500 });
  }
}
