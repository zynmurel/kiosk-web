'use client'
import { logoutInstructor } from "@/lib/api-helper/auth"
import { useStore } from "@/lib/store/app"
import { useEffect } from "react"

const InstructorStoreSetterLayout = ({
    children,
  }: Readonly<{ children: React.ReactNode }>) => {
    const { setUser } = useStore()
    
    useEffect(()=>{
      const localUser = window.localStorage.getItem("user-instructor") || null
      const user = ( localUser ? JSON.parse(localUser):null) as {username :string; role:string; user_id:string; department?:string} | null 
      if(user){
        setUser({
          id:Number(user.user_id),
          role:user.role,
          username:user.username,
          department : user.department || undefined
        })
      }else {
        void (async()=>await logoutInstructor())()
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return ( <>{children}</> );
}
 
export default InstructorStoreSetterLayout;