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
import { useSubjectContext } from "@/lib/context/admin/subject";
import { type SubjectType } from "@/lib/types/admin/subject";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useStore } from "@/lib/store/app";

const subject_type = [{
    value: "ALL",
    label: "All"
}, {
    value: "MINOR",
    label: "Minor"
}, {
    value: "MAJOR",
    label: "Major"
}]
const SubjectTable = ({ subjects, subjectsIsLoading }: {
    subjects: {
        id: number;
        code: string;
        departmenId: string;
        title: string;
        type: $Enums.subject_type;
        createdAt: Date;
        updatedAt: Date;
    }[] | null | undefined;
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

    const navigateToViewSubject = (path: string | number) => router.push("/admin/subjects/" + path)

    return (
        <div className="flex flex-col h-full bg-background rounded overflow-hidden xl:col-span-3 gap-2 border shadow-md">
            <div className=" bg-muted p-3 px-5  h-12">
                <p className="font-semibold">Courses of { user?.department?.toUpperCase()}</p>
            </div>
            <div className=" flex flex-row justify-between gap-5 px-2">
                <div className=" flex flex-row items-center gap-1">
                <Search className=" bg-muted h-full p-2 rounded w-10"/>
                    <Input value={state?.searchText} onChange={(e) => state?.setSearchText(e.target.value)} className=" xl:w-80" placeholder="Search course code" />
                </div>
                <Select onValueChange={(e) => state?.setSubjectType(e as SubjectType)} value={state?.subjectType}>
                    <SelectTrigger className=" w-40">
                        <SelectValue placeholder="Select subject type" />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            subject_type.map((type) => <SelectItem className="py-4" key={type.value} value={type.value}>{type.label}</SelectItem>)
                        }
                    </SelectContent>
                </Select>
            </div>
            <div className=" rounded overflow-hidden h-full flex flex-col justify-between p-2 pt-0">
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
                                key={subject.code}
                                className={`cursor-pointer ${id === subject.id.toString() && "bg-primary-foreground"}`}
                                onClick={() => navigateToViewSubject(subject.id)}
                            >
                                <TableCell>
                                    <span className=" text-sm font-bold flex flex-row gap-1 items-center w-full justify-between">{subject.code} <span>
                                        <Badge variant={subject.type === "MINOR" ? "secondary" : "default"} className=" text-xs px-2 xl:hidden inline">{subject.type}</Badge></span></span>
                                    <span className=" text-muted-foreground flex xl:hidden">{subject.title}</span>
                                </TableCell>
                                <TableCell className="hidden xl:table-cell">
                                    <span>{subject.title}</span>
                                </TableCell>
                                <TableCell className="hidden xl:table-cell">
                                    <Badge variant={subject.type === "MINOR" ? "secondary" : "default"} className=" text-xs">{subject.type}</Badge>
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
            </div>
        </div>);
}

export default SubjectTable;