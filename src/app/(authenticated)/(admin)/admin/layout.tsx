
import { getSessionForAdmin } from "@/lib/session";
import { redirect } from "next/navigation";
import {
  BookOpenText,
  CircleUser,
  GraduationCap,
  LibraryBig,
  Settings,
  UserCheck,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SideNavigation from "./_components/side-nav";
import MobileNavigation from "./_components/mobile-nav";
import LogoutButton from "../_components/logout-button";
import MostHeader from "@/app/_components/header";
import { ModeToggle } from "@/app/_components/theme-mode";
import Link from "next/link";



export default function Layout({ children }: { children: React.ReactNode }) {
  const session = getSessionForAdmin();
  if (session?.role !== "admin") {
    redirect(`/${session?.role}`);
  }
  const routes = [
    // {
    //   title: "Dashboard",
    //   route: "/admin",
    //   icon: <LayoutDashboard className="h-4 w-4" />
    // },
    {
      title: "Programs",
      route: "/admin/courses",
      icon: <GraduationCap className="h-4 w-4" />,
    },
    {
      title: "Courses",
      route: "/admin/subjects",
      icon: <BookOpenText className="h-4 w-4" />,
    },
    {
      title: "Curriculums",
      route: "/admin/curriculums",
      icon: <LibraryBig className="h-4 w-4" />,
    },
    {
      title: "Students",
      route: "/admin/students",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Instructors",
      route: "/admin/instructors",
      icon: <UserCheck className="h-4 w-4" />,
    },
    {
      title: "Settings",
      route: "/admin/settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];
  if(session.is_secretary === false){
    routes.push({
      title: "Secretaries",
      route: "/admin/secretary",
      icon: <UserCheck className="h-4 w-4" />,
    })
  }
  return (
    <div className="flex min-h-screen flex-col">
      <MostHeader />
      <div className="grid h-full w-full flex-1 md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r md:block">
          <SideNavigation routes={routes} />
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b px-4 lg:h-[60px] lg:px-6">
            <MobileNavigation routes={routes} />
            <div className="w-full flex-1"></div>
            <div className="flex flex-row gap-2">
              <div className="">
                <ModeToggle />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full"
                  >
                    <CircleUser className="h-5 w-5" />
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem><Link href={"/admin/account"}>Account</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <LogoutButton />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 bg-muted/80 p-4 dark:bg-muted/30 lg:gap-4 lg:p-6 xl:px-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
