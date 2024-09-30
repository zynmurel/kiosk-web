'use client'
import { usePathname } from "next/navigation";

const Layout = ({ children }: { children: React.ReactElement }) => {
    const pathname = usePathname()
    console.log(pathname)
    return (
        <>
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
            <div
                className="flex flex-1" x-chunk="dashboard-02-chunk-1"
            >
            <div className=" grid xl:grid-cols-5 gap-5 w-full">
                <div>
                    
                </div>
                <div className=" xl:col-span-4">
                    {children}
                </div>
            </div>
            </div>
        </>
    );
}

export default Layout;