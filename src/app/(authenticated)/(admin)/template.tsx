'use client'
import { logoutAdmin } from "@/lib/api-helper/auth"
import { useStore } from "@/lib/store/app"
import { useEffect } from "react"

const StoreSetterLayout = ({
    children,
  }: Readonly<{ children: React.ReactNode }>) => {
    const localUser = localStorage.getItem("user-admin") || null
    const user = ( localUser ? JSON.parse(localUser):null) as {username :string; role:string; user_id:string} | null 
    const { setUser } = useStore()
    
    useEffect(()=>{
      if(user){
        setUser({
          id:Number(user.user_id),
          role:user.role,
          username:user.username
        })
      }else {
        void (async()=>await logoutAdmin())()
      }
    },[])
    return ( <>{children}</> );
}
 
export default StoreSetterLayout;