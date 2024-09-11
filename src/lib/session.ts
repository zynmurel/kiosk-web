import { SECRET_KEY } from "./secret";
import jwt from 'jsonwebtoken';
import { type CredentialsType } from "./types/login";
import { cookies } from 'next/headers'; 

export function createSessionToken(payload: CredentialsType) {
    // Set token expiration (optional)
    const expiresIn = '7d'; // 7 days
  
    // Sign the JWT
    const token = jwt.sign(payload, SECRET_KEY, {
      expiresIn,
    });
  
    return token;
  }

export function verifySessionToken(token: string) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded as {
    username: string;
    password: string;
    role: string;
  };
  } catch (error) {
    console.error('Invalid token', error);
    return null;
  }
}

const getSession = (variable:string) => {
  const sessionCookie = cookies().get(variable);
  if (!sessionCookie) {
    return null;
  }

  const session = verifySessionToken(sessionCookie.value) as {
    username: string;
    password: string;
    role: string;
  }
  if(session){
    return session
  }else {
    return null
  }
}

export const getSessionForAdmin = () => getSession('learn-it-session-admin-token')
export const getSessionForInstructor = () =>  getSession('learn-it-session-instructor-token')
export const getSessionForStudent = () =>  getSession('learn-it-session-student-token')
export const getSessionForBusinness = () =>  getSession('learn-it-session-business-token')