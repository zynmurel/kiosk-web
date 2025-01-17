'use client'
import { logoutAdmin } from "@/lib/api-helper/auth"
import { useStore } from "@/lib/store/app"
import { useEffect } from "react"

const AdminStoreSetterLayout = ({
    children,
  }: Readonly<{ children: React.ReactNode }>) => {
    const { setUser } = useStore()
    
    useEffect(()=>{
      const localUser = window.localStorage.getItem("user-admin") || null
      const user = ( localUser ? JSON.parse(localUser):null) as {username :string; role:string; user_id:string; department?:string; is_secretary?:boolean} | null 
      if(user){
        setUser({
          id:Number(user.user_id),
          role:user.role,
          username:user.username,
          department : user.department || undefined,
          is_secretary:  user.is_secretary
        })
      }else {
        void (async()=>await logoutAdmin())()
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return ( <>{children}</> );
}
 
export default AdminStoreSetterLayout;