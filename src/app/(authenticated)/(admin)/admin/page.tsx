'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardLayout from "./_components/dashboard-layout";

const Page = () => {
  const router = useRouter()

  useEffect(()=>{
    void router.push("/admin/courses")
  },[router])
    return ( <DashboardLayout><></>
      </DashboardLayout> );
}
 
export default Page;