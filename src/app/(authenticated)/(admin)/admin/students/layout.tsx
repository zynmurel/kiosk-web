'use client'

import { StudentContext, type UpsertStudentType } from "@/lib/context/admin/student";
import { useStore } from "@/lib/store/app";
import { api } from "@/trpc/react";
import { useState } from "react";
const Layout = ({ children }: { children: React.ReactElement }) => {
    const { user } = useStore()
    const [ upsertStudent, setUpsertStudent] = useState<UpsertStudentType>(undefined)
    const [searchText, setSearchText] = useState("")
    const [courseCode, setCourseCode] = useState("ALL")

    //fetch data to use in another pages
    api.admin.global.getSelectableCourse.useQuery({
        departmenCode : user?.department || "",
    }, {
        enabled : !!user?.department
    })

    const { refetch } = api.admin.student.getStudentByCourse.useQuery({
      courseCode: courseCode,
      departmentCode: user?.department || "",
    }, {
      enabled : !!courseCode && !!user?.department
    })

    const refetchStudents = async () => {
        await refetch()
    }
    

    return (
        <StudentContext.Provider value={{ upsertStudent, setUpsertStudent, searchText, setSearchText, courseCode, setCourseCode, refetchStudents }}>
            <div className=" flex flex-row items-center justify-between">
                <div className="flex  flex-col">
                    <h3 className="text-2xl font-bold tracking-tight">
                        Students
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        List of all students registered in this Department.
                    </p>
                </div>
            </div>
            <div
                className="flex flex-1" x-chunk="dashboard-02-chunk-1"
            >
                {children}
            </div>
        </StudentContext.Provider>
    );
}

export default Layout;