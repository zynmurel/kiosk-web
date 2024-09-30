'use client'
import { InstructorSectionContext } from "@/lib/context/instructor/section";
import { useStore } from "@/lib/store/app";
import { api } from "@/trpc/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "./_components/loading";
import { Button } from "@/components/ui/button";
import { semesters, studentYear } from "@/lib/helpers/selections";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash } from "lucide-react";
import { type AvailableStudentsType } from "@/lib/types/instructor/section";
import TableStateAndPagination from "./_components/table-components/table-footer";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { PaginationType } from "@/lib/types/pagination";

const Page = () => {
    const { instructorOnSubjectId } = useParams()
    const { user } = useStore()
    const [showStudents, setShowStudents] = useState(false)
    const [selectedCourseCode, setSelectedCourseCode] = useState<string | undefined>(undefined)
    const [selectedStudents, setSelectedStudents] = useState<AvailableStudentsType[]>([])
    const [pagination, setPagination] = useState<PaginationType>({
        take: 10,
        skip: 0
    })

    const { data: instructorOnSubject, isLoading: instructorOnSubjectIsLoading } = api.instructor.section.getInstructorOnSubject.useQuery({
        id: Number(instructorOnSubjectId)
    }, {
        enabled: !Number.isNaN(Number(instructorOnSubjectId))
    })

    api.instructor.subject.getSelectableCourseCode.useQuery({
        id: user?.id || 0
    }, {
        enabled: !!user?.id
    })

    api.instructor.section.getAvailableStudents.useQuery({
        courseCode: selectedCourseCode || ""
    }, {
        enabled: !!selectedCourseCode
    })

    useEffect(() => {
        if (instructorOnSubject?.CurriculumSubjects.curriculum.courseCode) setSelectedCourseCode(instructorOnSubject?.CurriculumSubjects.curriculum.courseCode)
    }, [instructorOnSubject])

    return (
        
        <Card x-chunk="dashboard-04-chunk-1" className=" w-full relative p-0">
        <CardHeader className=" py-1 items-center px-5 font-semibold bg-muted flex flex-row justify-between">Students
        </CardHeader>
        <CardContent className=" py-2 px-5 font-semibold flex flex-col">
            {
                !selectedStudents.length ? <div onClick={() => setShowStudents(true)} className=" text-sm gap-1 hover:bg-muted cursor-pointer border rounded-xl p-10 flex items-center justify-center font-normal text-muted-foreground border-dashed">
                    <Plus size={20} />
                    Add Students
                </div> : <>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead className="w-[100px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {selectedStudents.sort((studA, studB) => studA.name.localeCompare(studB.name))?.slice(pagination.skip, pagination.skip + pagination.take).map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell className="w-[100px] py-2">{student.studentID}</TableCell>
                                    <TableCell className="py-2">{student.name}</TableCell>
                                    <TableCell className="w-[100px] py-2">
                                        <Button onClick={() => setSelectedStudents((prev)=>prev.filter(p=>p.id!== student.id))} type="button" variant={"destructive"} size={"sm"}>
                                            <Trash size={16} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TableStateAndPagination
                        isLoading={false}
                        data={selectedStudents || []}
                        pagination={pagination}
                        setPagination={setPagination}
                    /></>
            }
        </CardContent>
    </Card>);
}

export default Page;