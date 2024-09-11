
import { HydrateClient } from "@/trpc/server";
import { redirect } from 'next/navigation'; // For redirection
import { getSession } from "@/lib/session";

export default async function Home() {
  const session = getSession()
  if (!session){
    redirect("/login")
    return null
  }
  if (session?.role === 'admin') {
    redirect('/admin');
    return null
  } else if (session?.role === 'super-admin') {
    redirect('/super-admin');
    return null
  } else if(session?.role === 'instructor') {
    redirect('/instructor');
    return null
  } else if (session?.role === 'student') {
    redirect('/student');
    return null
  } else if (session?.role === 'bussiness') {
    redirect('/bussiness');
    return null
  } else 


  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      </main>
    </HydrateClient>
  );
}
