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
import { useStore } from "@/lib/store/app";

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
    const { user } = useStore()
    const [pagination, setPagination] = useState<PaginationType>({
        take: 10,
        skip: 0
    })

    const navigateToViewCourse = (path: string) => router.push("/admin/courses/" + path)

    return (
        <div className="flex flex-col h-full bg-background rounded overflow-hidden xl:col-span-3 border shadow-md">
        <div className=" bg-muted p-3 px-5  h-12">
        <p className="font-semibold">Programs of { user?.department?.toUpperCase()}</p>
        </div>
            <div className=" rounded overflow-hidden h-full flex flex-col justify-between p-2">
                <Table className=" border-b">
                    <TableHeader className=" bg-secondary">
                        <TableRow>
                        <TableHead className=" md:w-[120px]  xl:w-[150px] w-[100px]">Programs</TableHead>
                        <TableHead className="hidden xl:table-cell">Title</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {courses?.slice(pagination.skip, pagination.skip+pagination.take).map((course) => (
                            <TableRow
                                key={course.code}
                                className={`cursor-pointer ${code ===course.code && "bg-primary-foreground"}`}
                                onClick={()=>navigateToViewCourse(course.code)}
                            >
                                <TableCell>
                                    <span className=" text-sm font-bold">{course.code}</span>
                                    <span className=" text-muted-foreground flex xl:hidden">{course.title}</span>
                                </TableCell>
                                <TableCell className="hidden xl:table-cell">
                                    <span>{course.title}</span>
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