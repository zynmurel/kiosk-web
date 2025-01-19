'use client'
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const Layout = ({ children }: { children: React.ReactElement }) => {
    const router = useRouter()
    const navigateToAddSubject = () => router.push("/admin/subjects")
    return (
        <>
            <div className=" flex flex-row justify-between items-end">
                <div className="flex  flex-col">
                    <h3 className="text-2xl font-bold tracking-tight">
                        Courses
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        List of all courses available.
                    </p>
                </div>
                <Button size="sm" className="gap-1" variant={"outline"} onClick={navigateToAddSubject}>
                            <PlusCircle className="h-4 w-4" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Add Course
                            </span>
                        </Button>
            </div>
            <div
                className="flex flex-1" x-chunk="dashboard-02-chunk-1"
            >
                {children}
            </div>
        </>
    );
}

export default Layout;