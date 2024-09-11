'use client'
import { useStore } from "@/lib/store/app"
import axios from "axios"
import { useEffect } from "react"

const Template = ({
    children,
  }: Readonly<{ children: React.ReactNode }>) => {
    const localUser = localStorage.getItem("user") || null
    const user = ( localUser ? JSON.parse(localUser):null) as {username :string; role:string; user_id:string} | null 
    const { setUser } = useStore()

    const logout =async () => {
      await axios.post('/api/auth/logout')
      window.location.href = '/';
    }
    useEffect(()=>{
      if(user){
        setUser({
          id:Number(user.user_id),
          role:user.role,
          username:user.username
        })
      }else {
        void (async()=>await logout())()
      }
    },[])
    return ( <>{children}</> );
}
 
export default Template;