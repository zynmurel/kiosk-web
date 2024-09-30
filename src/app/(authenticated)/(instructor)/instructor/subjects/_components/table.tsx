'use client'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useParams, useRouter } from "next/navigation";
import TableStateAndPagination from "./table-components/table-footer";
import { type PaginationType } from "@/lib/types/pagination";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const SubjectTable = ({ subjects, subjectsIsLoading }: {
    subjects: {
        id: number;
        curriculumId: number;
        subjectId: number;
        createdAt: Date;
        updatedAt: Date;
        subject: {
            code: string;
            title: string;
            type: string;
        },
        curriculum: {
            courseCode: string;
        }
        InstructorOnSubject: {
            id: number;
        }[]
    }[] | undefined;
    subjectsIsLoading: boolean;
}) => {
    const router = useRouter()
    const { params } = useParams()
    const [pagination, setPagination] = useState<PaginationType>({
        take: 5,
        skip: 0
    })

    const navigateToViewSubject = (path: string | number) => router.push("/instructor/subjects/" + path)

    return (

        <div className=" rounded-md shadow overflow-hidden h-full flex flex-col justify-between pt-0 bg-background border">
            <Table className=" border-b">
                <TableHeader className=" bg-secondary">
                    <TableRow>
                        <TableHead className=" w-[100px]">Course</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead className=" md:w-[120px]  xl:w-[150px] w-[100px]">Type</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {subjects?.sort((subA, subB)=>subA.subject.code.localeCompare(subB.subject.code)).slice(pagination.skip, pagination.skip + pagination.take).map((subject) => (
                        <TableRow
                            key={subject.id}
                            className={`cursor-pointer ${params?.[0] === subject.id.toString() && "bg-primary-foreground"}`}
                            onClick={() => navigateToViewSubject(`${subject.id}/${subject.InstructorOnSubject[0]?.id}/${subject.subject.code}/${subject.subject.title}/${subject.subject.type}/${subject.curriculum.courseCode}`)}
                        >
                            <TableCell className=" w-[100px]">
                            <p className=" text-base font-bold">{subject.curriculum.courseCode}</p></TableCell>
                            <TableCell><div className=" flex flex-col">
                                <p className=" text-base font-bold">{subject.subject.code}</p>
                                <p>{subject.subject.title}</p>
                            </div></TableCell>
                            <TableCell className=" md:w-[120px]  xl:w-[150px] w-[100px]">
                                <Badge variant={subject.subject.type === "MINOR" ? "secondary" : "default"} className=" text-xs px-2 inline">{subject.subject.type}</Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <TableStateAndPagination
                isLoading={subjectsIsLoading}
                data={subjects || []}
                pagination={pagination}
                setPagination={setPagination}
            />
        </div>);
}

export default SubjectTable;