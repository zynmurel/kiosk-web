'use client'
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import { useStore } from "@/lib/store/app";
import { api } from "@/trpc/react";
import InstructorsTable from "./_components/table";
import UpsertInstructorDrawer from "./_components/drawer-instructor";
import { useInstructorContext } from "@/lib/context/instructor";

const Page = () => {
  const state = useInstructorContext()
  const { user } = useStore()
  const { data: instructors, isLoading: instructorsIsLoading } = api.admin.instructor.getInstructorsInDepartment.useQuery({
    departmentCode: user?.department || "",
  }, {
    enabled: false
  })
  
  return (
    <div className="flex flex-col h-full bg-background rounded overflow-hidden gap-2 border shadow-md w-full">
      <div className=" bg-muted p-3 px-5  h-12">
        <p className="font-semibold">Intructors of {user?.department?.toUpperCase()}</p>
      </div>
      <div className=" flex flex-row justify-between gap-5 xl:px-5 px-2">
        <div className=" flex flex-row items-center gap-2">
          <Search className=" bg-muted h-full p-2 rounded w-10" />
          <Input value={state?.searchText} onChange={(e) => state?.setSearchText(e.target.value)} className=" xl:w-80" placeholder="Search Employee ID" />
        </div>
        <div className=" flex flex-row items-center gap-2">
          <UpsertInstructorDrawer />
        </div>
      </div>
      <InstructorsTable instructors={instructors?.filter((instructor)=>instructor.employeeID.includes(state?.searchText || ""))} instructorsIsLoading={instructorsIsLoading}/>
    </div>
  );
}

export default Page;