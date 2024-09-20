'use client'
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useStudentContext } from "@/lib/context/student";
import UpsertStudentDrawer from "./_components/drawer-student";
import { useStore } from "@/lib/store/app";
import { api } from "@/trpc/react";
import StudentsTable from "./_components/table";
import UpsertInstructorDrawer from "../instructors/_components/drawer-instructor";

const Page = () => {
  const state = useStudentContext()
  const { user } = useStore()
  const { data: selectableCourses, isLoading: selectableCoursesIsLoading } = api.admin.global.getSelectableCourse.useQuery({
    departmenCode: user?.department || "",
  }, {
    enabled: false
  })

  const { data: students, isLoading: studentsIsLoading } = api.admin.student.getStudentByCourse.useQuery({
    courseCode: state?.courseCode || "ALL",
    departmentCode: user?.department || "",
  }, {
    enabled : false
  })
  
  return (
    <div className="flex flex-col h-full bg-background rounded overflow-hidden gap-2 border shadow-md w-full">
      <div className=" bg-muted p-3 px-5  h-12">
        <p className="font-semibold">Students of {user?.department?.toUpperCase()}</p>
      </div>
      <div className=" flex flex-row justify-between gap-5 xl:px-5 px-2">
        <div className=" flex flex-row items-center gap-2">
          <Search className=" bg-muted h-full p-2 rounded w-10" />
          <Input value={state?.searchText} onChange={(e) => state?.setSearchText(e.target.value)} className=" xl:w-80" placeholder="Search Student ID" />
        </div>
        <div className=" flex flex-row items-center gap-2">
          <Select
            disabled={selectableCoursesIsLoading}
            onValueChange={(e) => state?.setCourseCode(e)} 
            value={state?.courseCode}
          >
            <SelectTrigger className=" w-32 md:w-60 xl:w-96">
              <SelectValue placeholder="Filter by Course" />
            </SelectTrigger>
            <SelectContent>
              {
                [{ label : "All Courses", value:"ALL"},...(selectableCourses || [])].map((type) => <SelectItem key={type.value} value={type.value}>
                  <span className="text-start text-nowrap">{type.label}</span>
                </SelectItem>)
              }
            </SelectContent>
          </Select>
          <UpsertStudentDrawer />
        </div>
      </div>
      <StudentsTable students={students?.filter((student)=>student.studentID.includes(state?.searchText || ""))} studentsIsLoading={studentsIsLoading}/>
    </div>
  );
}

export default Page;