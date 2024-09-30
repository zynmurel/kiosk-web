'use client'
import { useStore } from "@/lib/store/app";
import * as React from "react"
import { Plus, PlusCircle, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Loading from "./loading";
import { Toaster } from "@/components/ui/toaster";
import { useInstructorSectionContext } from "@/lib/context/instructor/section";
import { api } from "@/trpc/react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import TableStateAndPagination from "./table-components/table-footer";
import { type PaginationType } from "@/lib/types/pagination";
import { Input } from "@/components/ui/input";
import { type AvailableStudentsType } from "@/lib/types/instructor/section";


export default function StudentsDrawer({ isLoading, courseCode, setCourseCode, searchText, setSearchText, selectedStudents, setSelectedStudents }: {
  isLoading: boolean;
  courseCode: string | undefined
  setCourseCode: React.Dispatch<React.SetStateAction<string | undefined>>;
  searchText : string;
  setSearchText : React.Dispatch<React.SetStateAction<string>>
  selectedStudents : AvailableStudentsType[] 
  setSelectedStudents : React.Dispatch<React.SetStateAction<AvailableStudentsType[]>>
}) {
  const { user } = useStore()
  const state = useInstructorSectionContext()
  const [pagination, setPagination] = React.useState<PaginationType>({
      take: 10,
      skip: 0
  })

  const { data: availableStudents, isLoading: availableStudentsIsLoading } = api.instructor.section.getAvailableStudents.useQuery({
    courseCode: courseCode || ""
  }, {
    enabled: false
  })

  if (!state) {
    return
  }

  const { data: selectableCourseCode, isLoading: selectableCourseCodeIsLoading } = api.instructor.subject.getSelectableCourseCode.useQuery({
    id: user?.id || 0
  }, {
    enabled: !!user?.id
  })

  const { setShowStudents, showStudents } = state

  const handleClose = () => {
    setShowStudents(false)
  }

  const students = availableStudents
  ?.filter((stud)=>!selectedStudents.map((s)=>s.id).includes(stud.id))
  ?.filter((stud)=>stud.studentID.toLowerCase().includes(searchText.toLowerCase()))

  const pagedStudents = students
  ?.slice(pagination.skip, pagination.skip + pagination.take)

  return (
    <Drawer direction="left" open={showStudents} onClose={handleClose}>
      <Button type="button" className=" mt-0 gap-1" variant={"outline"} onClick={() => setShowStudents(true)}>
        <PlusCircle className="h-4 w-4" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Add Students
        </span>
      </Button>
      <DrawerContent className=" w-full sm:w-[650px] h-screen overflow-y-scroll no-scrollbar">
        <Toaster />
        {(availableStudentsIsLoading || isLoading) &&
          <div className=" absolute bg-background opacity-50 z-10 top-0 left-0 right-0 bottom-0 flex items-center justify-center">
            <Loading />
          </div>}
        <div className="w-full px-5">
          <Button variant={"ghost"} onClick={handleClose} className=" absolute right-2 top-2"><X /></Button>
          <DrawerHeader className=" p-0 pt-2">
            <DrawerTitle>Student</DrawerTitle>
            <DrawerDescription>Select students to add in your section to create</DrawerDescription>
          </DrawerHeader>
          <p className=" font-bold mt-5">{courseCode} Students</p>
          <div className=" flex flex-row items-center justify-between gap-5">
            <Input placeholder="Search student ID" onChange={(e)=>setSearchText(e.target.value)} value={searchText}/>
            <Select disabled={selectableCourseCodeIsLoading} value={courseCode} onValueChange={(e) => setCourseCode(e)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Change course" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Courses</SelectLabel>
                  {
                    selectableCourseCode?.map((course) => {
                      return <SelectItem key={course.courseCode} value={course.courseCode}>{course.courseCode}</SelectItem>
                    })
                  }
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableCaption>A list of students in {courseCode}.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagedStudents?.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className=" py-2">
                    <div className=" gap-2 flex flex-row py-2 items-center h-full">
                      <span className=" font-bold">{student.studentID}</span>{student.name}
                    </div></TableCell>
                  <TableCell className="w-[100px] py-2">
                    <div className=" items-center justify-center flex">
                      <div
                      onClick={()=>setSelectedStudents(prev=>[
                        ...prev,
                        student
                      ])}
                       className=" cursor-pointer hover:bg-muted rounded border items-center justify-center flex p-2">
                        <Plus size={18} />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
                <TableStateAndPagination
                    isLoading={availableStudentsIsLoading}
                    data={students || []}
                    pagination={pagination}
                    setPagination={setPagination}
                />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
