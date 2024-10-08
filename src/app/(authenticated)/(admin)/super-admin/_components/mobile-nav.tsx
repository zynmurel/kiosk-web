'use client'
import Link from "next/link"
import {
  Menu,
  Package2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"


import { usePathname } from "next/navigation"
import { useStore } from "@/lib/store/app"
const MobileNav = ({ routes }: {
  routes: {
    title: string;
    route: string;
    icon: JSX.Element;
  }[]
}) => {
  const { user} = useStore()
  const pathname = usePathname()
  const isActive = (route: string) => {
    const path = pathname.split("/")[2] || ""
    const rt = route.split("/")[2] || ""
    return rt === path
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col h-full justify-between">
        <nav className="grid gap-2 text-lg font-medium">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <Package2 className="h-6 w-6" />
              <span className=" flex flex-col">
              <span className="">LEarn</span>
              <span className=" text-xs font-normal -mt-1 capitalize">{user?.role.replace("-", " ")}</span>
              </span>
          </Link>
          {
            routes.map((route, index) => (
              <Link
                key={index}
                href={route.route}
                className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${!isActive(route.route) ? "text-muted-foreground" : "text-foreground"}`}
              >
                {route.icon}
                {route.title}
              </Link>
            ))
          }
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNav;