import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { type CredentialsType } from '@/lib/types/login';
import { createSessionToken } from '@/lib/session';
import { cookieVariables } from '@/lib/api-helper/cookie-variables';

export async function POST(req: NextRequest) {
    const { username, password, role }= await req.json().then((data)=>{
      return {...data} as CredentialsType
    }) 

    if (!username || !password) {
      return NextResponse.json({ error: 'Missing Required Fields' }, { status: 400 });
    }

    try {

      if(role ==="super-admin"){

          const user = await db.superAdmin.findUnique({ 
              where: { employeeID : username },
            });

          if (!user) {
            return NextResponse.json({ error: 'User not found.' }, { status: 401 });
          }
          const passwordMatch = password === user.password
    
          if (!passwordMatch) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
          }
          const sessionToken = createSessionToken({ username, password, role, id:user.id})
          const response = NextResponse.json({ message: 'Login successful', user: { username, role, user_id:user.id } }, { status: 200 });
          response.cookies.set(cookieVariables.admin, sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
          });
          return response
      }

      if(role ==="admin"){

          const user = await db.admin.findUnique({ 
              where: { employeeID : username },
            });

          if (!user) {
            return NextResponse.json({ error: 'User not found.' }, { status: 401 });
          }
          const passwordMatch = password === user.password
    
          if (!passwordMatch) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
          }
          const sessionToken = createSessionToken({ username, password, role, id:user.id})
          const response = NextResponse.json({ message: 'Login successful', user: { username, role, user_id:user.id } }, { status: 200 });
          response.cookies.set(cookieVariables.admin, sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
          });
          return response
      }

    } catch (error) {
      console.log(error)
      return NextResponse.json({ error: 'Error logging in' }, { status: 500 });
    }

}