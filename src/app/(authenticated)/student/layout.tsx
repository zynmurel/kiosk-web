import { getSessionForStudent } from "@/lib/session";
import HeaderStudent from "./_componentsStudent/Header";
import SideBarStudent from "./_componentsStudent/Sidebar";
import { redirect } from "next/navigation";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const session = getSessionForStudent();
  if (!session) {
    redirect("/login-student");
  }

  return (
    <div className="relative grid min-h-screen min-w-full bg-muted/40">
      <SideBarStudent />
      <div className="ml-[60px] lg:ml-[280px]">
        <div className="fixed left-0 right-0 top-0 z-50 flex w-auto items-center justify-between sm:left-[60px] lg:left-[280px]">
          <HeaderStudent />
        </div>
        <main className="my-20 w-full p-6 sm:px-6 sm:py-0 lg:my-16 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
