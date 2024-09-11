import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import {
  Building2,
  CircleUser,
  GraduationCap,
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

const routes = [
  {
    title : "Departments",
    route : "/super-admin/departments",
    icon : <Building2 className="h-4 w-4" />
  },
  {
    title : "Deans",
    route : "/super-admin/deans",
    icon : <Users className="h-4 w-4" />
  },
  {
    title : "Courses",
    route : "/super-admin/courses",
    icon : <GraduationCap className="h-4 w-4" />
  },
  {
    title : "Instructors",
    route : "/super-admin/instructors",
    icon : <Users className="h-4 w-4" />
  },
  {
    title : "Settings",
    route : "/super-admin/settings",
    icon : <Settings className="h-4 w-4" />
  }
]

export default function Layout({children}:{children: React.ReactNode}) {
  const session = getSession()
  if(session?.role!=="super-admin") {
    redirect(`/${session?.role}`)
  }
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
      <SideNavigation routes={routes}/>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <MobileNavigation routes={routes}/>
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
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
