import { getSessionForInstructor } from "@/lib/session";
import { redirect } from "next/navigation";
import {
    BookOpenText,
    CircleUser,
    LayoutTemplate,
    Settings,
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
import SideNavigation from "./_dashboard_components/side-nav";
import MobileNavigation from "./_dashboard_components/mobile-nav";
import LogoutButton from "./_dashboard_components/logout-button";
import MostHeader from "@/app/_components/header";
import { ModeToggle } from "@/app/_components/theme-mode";
import Link from "next/link";

const routes = [
    {
        title: "Subjects",
        route: "/instructor/subjects",
        icon: <BookOpenText className="h-4 w-4" />,
    },
    {
        title: "Sections",
        route: "/instructor/sections",
        icon: <LayoutTemplate className="h-4 w-4" />,
    },
    {
        title: "Students",
        route: "/instructor/students",
        icon: <Users className="h-4 w-4" />,
    },
    {
        title: "Account",
        route: "/instructor/account",
        icon: <Settings className="h-4 w-4" />,
    },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = getSessionForInstructor();
    if (session?.role !== "instructor") {
        redirect(`/${session?.role}`);
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
