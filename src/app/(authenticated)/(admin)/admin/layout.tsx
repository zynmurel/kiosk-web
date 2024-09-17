import { getSessionForAdmin } from "@/lib/session"
import { redirect } from "next/navigation"
import {
  BookOpenText,
  Building2,
  CircleUser,
  GraduationCap,
  LayoutDashboard,
  LibraryBig,
  Settings,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import SideNavigation from "./_components/side-nav"
import MobileNavigation from "./_components/mobile-nav"
import LogoutButton from "../_components/logout-button"
import MostHeader from "@/app/_components/header"

const routes = [
  {
    title: "Dashboard",
    route: "/admin",
    icon: <LayoutDashboard className="h-4 w-4" />
  },
  {
    title: "Courses",
    route: "/admin/courses",
    icon: <GraduationCap className="h-4 w-4" />
  },
  {
    title: "Subjects",
    route: "/admin/subject",
    icon: <BookOpenText className="h-4 w-4" />
  },
  // {
  //   title: "Curriculums",
  //   route: "/admin/curriculums",
  //   icon: <LibraryBig className="h-4 w-4" />
  // },
  {
    title: "Instructors",
    route: "/admin/instructors",
    icon: <Users className="h-4 w-4" />
  },
  {
    title: "Settings",
    route: "/admin/settings",
    icon: <Settings className="h-4 w-4" />
  }
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const session = getSessionForAdmin()
  if (session?.role !== "admin") {
    redirect(`/${session?.role}`)
  }
  return (
    <div className=" min-h-screen flex flex-col">
      <MostHeader/>
      <div className="grid flex-1 h-full w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r md:block ">
          <SideNavigation routes={routes} />
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b px-4 lg:h-[60px] lg:px-6">
            <MobileNavigation routes={routes} />
            <div className="w-full flex-1">
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <LogoutButton />
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-4 xl:px-20 lg:p-6 bg-muted/50">
            {children}
          </main>
        </div>
      </div>
    </div>

  )
}
