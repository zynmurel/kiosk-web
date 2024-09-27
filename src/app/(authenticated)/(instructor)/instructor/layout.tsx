import { getSessionForInstructor } from "@/lib/session";
import { redirect } from 'next/navigation';
import DashboardLayout from "./_components/dashboard_layout";

const AuthenticatedLayout = ({
    children,
  }: Readonly<{ children: React.ReactNode }>) => {  
    const session = getSessionForInstructor()
    if(!session) {
      redirect("/login-instructor")
    }
    return ( 
      <DashboardLayout>{children}</DashboardLayout>
     );
}
 
export default AuthenticatedLayout;