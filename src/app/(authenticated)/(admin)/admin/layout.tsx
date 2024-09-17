import { getSessionForAdmin } from "@/lib/session"
import { redirect } from "next/navigation"
import {
  Building2,
  CircleUser,
  Facebook,
  GraduationCap,
  Instagram,
  Phone,
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

const routes = [
  {
    title: "Departments",
    route: "/super-admin/departments",
    icon: <Building2 className="h-4 w-4" />
  },
  {
    title: "Deans",
    route: "/super-admin/deans",
    icon: <Users className="h-4 w-4" />
  },
  {
    title: "Courses",
    route: "/super-admin/courses",
    icon: <GraduationCap className="h-4 w-4" />
  },
  {
    title: "Instructors",
    route: "/super-admin/instructors",
    icon: <Users className="h-4 w-4" />
  },
  {
    title: "Settings",
    route: "/super-admin/settings",
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
          <div className=" bg-emerald-500 p-2 dark:bg-emerald-900 px-5 font-extralight text-slate-100 flex tracking-widest text-sm flex-row justify-between">
            <p><span className=" font-bold">LEARN IT </span> 
            | Northwest Samar State University
            </p>
            <div className=" flex-row flex gap-2 text-xs">
            <p className=" flex flex-row items-center gap-1 px-1 cursor-pointer rounded"><Facebook size={15} />Facebook</p>|
            <p className=" flex flex-row items-center gap-1 px-1 cursor-pointer rounded"><Phone size={15} />Contact</p>
            </div>
          </div>
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
