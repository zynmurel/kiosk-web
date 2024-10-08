import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { type CredentialsType } from '@/lib/types/login';
import { createSessionToken } from '@/lib/session';
import { cookieVariables } from '@/lib/api-helper/cookie-variables';

export async function POST(req: NextRequest) {
  const { username, password, role } = await req.json().then((data) => {
    return { ...data } as CredentialsType & { password: string }
  })

  if (!username || !password) {
    return NextResponse.json({ error: 'Missing Required Fields' }, { status: 400 });
  }

  try {

    if (role === "student") {

      const user = await db.student.findUnique({
        where: { studentID: username },
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found.' }, { status: 401 });
      }
      const passwordMatch = password === user.password

      if (!passwordMatch) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
      const sessionToken = createSessionToken({ username, role, id: user.id, department: user.departmentCode })
      const response = NextResponse.json({ message: 'Login successful', user: { 
        username, 
        role, 
        user_id: user.id, 
        department: user.departmentCode, 
        fullName: `${user.firstName} ${user.middleName ? user.middleName[0] + '.' : ""} ${user.lastName}` 
      } }, { status: 200 });
      response.cookies.set(cookieVariables.student, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      });
      return response
    } else {
      return NextResponse.json({ error: 'User role error.' }, { status: 400 });
    }

  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Error logging in' }, { status: 500 });
  }

}