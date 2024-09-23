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
import { type $Enums } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useSubjectContext } from "@/lib/context/subject";
import { type SubjectType } from "@/lib/types/admin/subject";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useStore } from "@/lib/store/app";

const SubjectTable = ({ subjects, subjectsIsLoading }: {
    subjects: {
        id: number;
        curriculumId: number;
        subjectId: number;
        instructorId: number;
        createdAt: Date;
        updatedAt: Date;
    }[] | undefined
    subjectsIsLoading: boolean;
}) => {
    const router = useRouter()
    const { id } = useParams()
    const { user } = useStore()
    const state = useSubjectContext()
    const [pagination, setPagination] = useState<PaginationType>({
        take: 10,
        skip: 0
    })

    const navigateToViewSubject = (path: string | number) => router.push("/instructor/subjects/" + path)

    return (
        
        <div className=" rounded overflow-hidden h-full flex flex-col justify-between pt-0 bg-background">
        <Table className=" border-b">
            <TableHeader className=" bg-secondary">
                <TableRow>
                    <TableHead className=" md:w-[120px]  xl:w-[150px] w-[100px]">Subjects</TableHead>
                    <TableHead className="hidden xl:table-cell">Title</TableHead>
                    <TableHead className="hidden xl:table-cell">Type</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {subjects?.slice(pagination.skip, pagination.skip + pagination.take).map((subject) => (
                    <TableRow
                        key={subject.id}
                        className={`cursor-pointer ${id === subject.id.toString() && "bg-primary-foreground"}`}
                        onClick={() => navigateToViewSubject(subject.id)}
                    >
                        {/* <TableCell>
                            <span className=" text-sm font-bold flex flex-row gap-1 items-center w-full justify-between">{subject.code} <span>
                                <Badge variant={subject.type === "MINOR" ? "secondary" : "default"} className=" text-xs px-2 xl:hidden inline">{subject.type}</Badge></span></span>
                            <span className=" text-muted-foreground flex xl:hidden">{subject.title}</span>
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                            <span>{subject.title}</span>
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                            <Badge variant={subject.type === "MINOR" ? "secondary" : "default"} className=" text-xs">{subject.type}</Badge>
                        </TableCell> */}
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