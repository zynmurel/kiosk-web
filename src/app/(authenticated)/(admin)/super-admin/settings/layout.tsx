'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
const routes = [
    {
      name: "System Settings",
      path: "/super-admin/settings"
    },
    // {
    //     name : "Account",
    //     path: "/admin/settings/account"
    // },
    {
      name: "Account Settings",
      path: "/super-admin/settings/account"
    }
  ]
const Layout = ({ children }: { children: React.ReactElement }) => {
    const path = usePathname()
    return (
        <>
            <div className=" flex flex-row items-center justify-between">
                <div className="flex  flex-col">
                    <h3 className="text-2xl font-bold tracking-tight">
                        Settings
                    </h3>
                    <p className="text-sm text-muted-foreground">
                    Discover settings and options.
                    </p>
                </div>
                
            </div>
            <div
                className="flex flex-1" x-chunk="dashboard-02-chunk-1"
            >
            <div className="mx-auto grid w-full items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
              <nav
                className="grid gap-4 text-base text-muted-foreground" x-chunk="dashboard-04-chunk-0"
              >
                {
                  routes.map((route) => {
                    return <Link className={path === route.path ? "font-semibold text-primary" : ""} key={route.path} href={route.path}>{route.name}</Link>
                  })
                }
              </nav>
              {children}
            </div>
            </div>
        </>
    );
}

export default Layout;