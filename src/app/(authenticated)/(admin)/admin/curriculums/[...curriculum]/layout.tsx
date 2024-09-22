'use client'
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const CurriculumLayout = ({ children }: { children: React.ReactElement }) => {
    const router = useRouter()
    return (
        <>
            <div className=" flex flex-row items-end justify-between">
                <div className="flex  flex-col">
                    <h3 className="text-2xl font-bold tracking-tight">
                        Curriculum
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        List of all curriculum filtered.
                    </p>
                </div>
                <Button className="gap-1" type="button" variant={"outline"} onClick={() => router.push("/admin/curriculums/create")}>
                    <PlusCircle className="h-4 w-4" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add Curriculum
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

export default CurriculumLayout;