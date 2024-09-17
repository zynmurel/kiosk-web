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

const CourseTable = ({courses, coursesIsLoading}:{
    courses : {
        code: string;
        title: string;
        departmenCode: string;
        createdAt: Date;
        updatedAt: Date;
    }[] | null | undefined;
    coursesIsLoading:boolean;
}) => {
    const router = useRouter()
    const { code } = useParams()
    const [pagination, setPagination] = useState<PaginationType>({
        take: 10,
        skip: 0
    })

    const navigateToViewCourse = (path: string) => router.push("/admin/courses/" + path)

    return (
        <div className="flex flex-col h-full">
            <div className=" border rounded overflow-hidden h-full flex flex-col justify-between">
                <Table>
                    <TableHeader className=" bg-secondary">
                        <TableRow>
                            <TableHead className=" md:w-[120px]  xl:w-[150px] w-[100px]">Course</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {courses?.map((course) => (
                            <TableRow
                                key={course.code}
                                className={`cursor-pointer ${code ===course.code && "bg-primary-foreground"}`}
                                onClick={()=>navigateToViewCourse(course.code)}
                            >
                                <TableCell className=" flex flex-col">
                                    <span className=" text-xl font-bold">{course.code}</span>
                                    <span className=" text-muted-foreground">{course.title}</span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TableStateAndPagination
                    isLoading={coursesIsLoading}
                    data={courses || []}
                    pagination={pagination}
                    setPagination={setPagination}
                />
            </div>
        </div>);
}

export default CourseTable;