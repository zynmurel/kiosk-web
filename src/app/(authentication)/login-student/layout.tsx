import { getSessionForInstructor, getSessionForStudent } from "@/lib/session";
import { redirect } from "next/navigation";

const Layout = ({
    children,
  }: Readonly<{ children: React.ReactNode }>) => {
    const session = getSessionForStudent()
 
    if(session?.role) {
      redirect(`/${session?.role}`)
    }
    return ( <>{children}</> );
}
 
export default Layout;