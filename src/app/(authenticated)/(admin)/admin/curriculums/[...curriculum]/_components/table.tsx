'use client'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import TableStateAndPagination from "./table-components/table-footer";
import { type PaginationType } from "@/lib/types/pagination";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LoaderCircle, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { semesters, studentYear } from "@/lib/helpers/selections";
import { useRouter } from "next/navigation";
const CurriculumsTable = ({curriculums, curriculumsIsLoading}:{
    curriculums: {
        id:number;
        courseCode: string;
        student_year: number;
        semester: number;
        sectionCount: number;
        subjectCount: number;
        school_year:string;
    }[] | undefined;
    curriculumsIsLoading:boolean;
}) => {
    const router = useRouter()
    const [idLoading, setIdLoading] = useState<number | undefined>(undefined)
    const [pagination, setPagination] = useState<PaginationType>({
        take: 10,
        skip: 0
    })
    return (
        <div className="flex flex-col h-full bg-background rounded overflow-hidden xl:col-span-3 gap-2">
            
            <div className=" rounded overflow-hidden h-full">
                <Table className=" border-b">
                    <TableHeader className=" bg-secondary">
                        <TableRow>
                            <TableHead className=" md:w-[120px]  xl:w-[150px] w-[100px]">Course Code</TableHead>
                            <TableHead className="">Student Year</TableHead>
                            <TableHead className="">Semester</TableHead>
                            <TableHead className="hidden xl:table-cell w-[100px] text-center">Sections</TableHead>
                            <TableHead className="hidden xl:table-cell w-[100px] text-center">Subjects</TableHead>
                            <TableHead className="w-[100px]">Action</TableHead>
                        </TableRow>
                    </TableHeader> 
                    <TableBody>
                        {curriculums?.slice(pagination.skip, pagination.skip + pagination.take).map((curriculum) => (
                            <TableRow
                                key={curriculum.id}
                                className={`cursor-pointer`}
                            >
                                    <TableCell className=" md:w-[120px]  xl:w-[150px] w-[100px]">{curriculum.courseCode}</TableCell>
                                    <TableCell className="">{studentYear.find((st)=>st.value===curriculum.student_year)?.label}</TableCell>
                                    <TableCell className="">{semesters.find((st)=>st.value===curriculum.semester)?.label}</TableCell>
                                    <TableCell className="hidden xl:table-cell w-[100px] text-center">{curriculum.sectionCount}</TableCell>
                                    <TableCell className="hidden xl:table-cell w-[100px] text-center">{curriculum.subjectCount}</TableCell>
                                    <TableCell className="w-[100px]">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    aria-haspopup="true"
                                                    size="icon"
                                                    variant="ghost"
                                                >
                                                    {idLoading===curriculum.id  ? <LoaderCircle className="w-4 h-4 animate-spin"/> : <MoreHorizontal className="w-4 h-4" />}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    onClick={()=>router.push(`/admin/curriculums/selected/${curriculum.courseCode}/${curriculum.school_year}/${curriculum.student_year}/${curriculum.semester}`)}
                                                >View</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TableStateAndPagination
                    isLoading={curriculumsIsLoading}
                    data={curriculums || []}
                    pagination={pagination}
                    setPagination={setPagination}
                />
            </div>
        </div>);
}

export default CurriculumsTable;