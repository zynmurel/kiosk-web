'use client'

import { InstructorContext, type UpsertInstructorType } from "@/lib/context/admin/instructor";
import { useStore } from "@/lib/store/app";
import { api } from "@/trpc/react";
import { useState } from "react";
const Layout = ({ children }: { children: React.ReactElement }) => {
    const { user } = useStore()
    const [ upsertInstructor, setUpsertInstructor] = useState<UpsertInstructorType>(undefined)
    const [searchText, setSearchText] = useState("")

    const { refetch } = api.admin.instructor.getInstructorsInDepartment.useQuery({
        departmentCode : user?.department || "",
    }, {
        enabled : !!user?.department
    })

    const refetchInstructors = async () => {
        await refetch()
    }
    
    return (
        <InstructorContext.Provider value={{ upsertInstructor, setUpsertInstructor, searchText, setSearchText, refetchInstructors }}>
            <div className=" flex flex-row items-center justify-between">
                <div className="flex  flex-col">
                    <h3 className="text-2xl font-bold tracking-tight">
                        Instructors
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        List of all instructors in this Department.
                    </p>
                </div>
            </div>
            <div
                className="flex flex-1" x-chunk="dashboard-02-chunk-1"
            >
                {children}
            </div>
        </InstructorContext.Provider>
    );
}

export default Layout;