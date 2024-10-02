'use client'

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { useStore } from "@/lib/store/app";

const routes = (id: string) => {
    return [{
        route: `/instructor/sections/section/${id}`,
        label: 'Overview'
    }, {
        route: `/instructor/sections/section/${id}/attendance`,
        label: 'Attendance'
    }, {
        route: `/instructor/sections/section/${id}/activities`,
        label: 'Activities'
    }, {
        route: `/instructor/sections/section/${id}/students`,
        label: 'Students'
    }]
}

const Layout = ({ children }: { children: React.ReactElement }) => {
    const { id } = useParams()
    const { user } = useStore()
    const path = usePathname()

    const isPath = (route: string) => {
        return route.split("/")[5] === path.split("/")[5]
    }
    const routeName = routes(id as string).find((route) => route.route.split("/")[5] === path.split("/")[5])?.label

    api.instructor.section.getSection.useQuery({
        id: Number(id),
        instructorId: Number(user?.id)
    }, {
        enabled: !Number.isNaN(Number(id) + Number(user?.id))
    })

    return (
        <>

            <div
                className="flex flex-1" x-chunk="dashboard-02-chunk-1"
            >
                <div className=" flex flex-col xl:grid xl:grid-cols-5 gap-5 w-full">
                    <div className=" flex flex-col px-0 gap-2">
                        <div className=" flex flex-row justify-between items-end">
                            <div className="flex  flex-col">
                                <h3 className="text-2xl font-bold tracking-tight">
                                    Section
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Manage attendance, quizzes, assignments, exams and others of your section.
                                </p>
                            </div>
                        </div>
                        <div className=" xl:flex-col flex-row flex">
                            {
                                routes(id as string).map(({ label, route }) => {
                                    return <Link key={route} href={route}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm  transition-all hover:text-primary ${isPath(route) ? "bg-muted font-semibold" : "text-muted-foreground"}`}
                                    >{label}</Link>
                                })
                            }
                        </div>
                    </div>
                    <div className=" xl:col-span-4">
                        <Card x-chunk="dashboard-04-chunk-1" className=" w-full relative p-0">
                            <CardHeader className=" py-2 items-center px-5 font-semibold bg-muted flex flex-row justify-between">{routeName}
                            </CardHeader>
                            <CardContent className=" py-2 px-5 font-semibold flex flex-col">
                                {children} </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Layout;