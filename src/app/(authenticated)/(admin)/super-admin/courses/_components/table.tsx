'use client'
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import TableStateAndPagination from "./table-components/table-footer";
import { type PaginationType } from "@/lib/types/pagination";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react";
import { api } from "@/trpc/react";

const CourseTable = ({selectedDepartment, isLoading}:{selectedDepartment: string|undefined; isLoading:boolean}) => {
    const router = useRouter()
    const [pagination, setPagination] = useState<PaginationType>({
        take: 10,
        skip: 0
    })
    const { data: courses, isLoading: coursesIsLoading } = api.super.course.getCourseByDepartment.useQuery({
        departmenCode: selectedDepartment
    }, {
        enabled: !!selectedDepartment
    })


    const navigateToViewCourse = (path: string) => () => router.push("/super-admin/course/" + path)

    return (
        <div className="flex flex-col">
            <div className=" border rounded overflow-hidden">
                <Table>
                    <TableHeader className=" bg-secondary">
                        <TableRow>
                            <TableHead className=" md:w-[120px]  xl:w-[150px] w-[100px]">Code</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead className=" md:w-[120px]  xl:w-[150px] w-[100px]">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {courses?.map((course) => (
                            <TableRow
                                key={course.code}
                            >
                                <TableCell className=" md:w-[120px]  xl:w-[150px] w-[100px]">{course.code}</TableCell>
                                <TableCell>{course.title}</TableCell>
                                <TableCell className=" md:w-[120px]  xl:w-[150px] w-[100px]">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                aria-haspopup="true"
                                                size="icon"
                                                variant="ghost"
                                            >
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem
                                                onClick={navigateToViewCourse(course.code)}
                                            >View</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <TableStateAndPagination
                isLoading={coursesIsLoading || isLoading}
                data={courses || []}
                pagination={pagination}
                setPagination={setPagination}
            />
        </div>);
}

export default CourseTable;