'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const router = useRouter()

  useEffect(()=>{
    void router.push("/super-admin/departments")
  },[router])
    return ( <></> );
}
 
export default Page;