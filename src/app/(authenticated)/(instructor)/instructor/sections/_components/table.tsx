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
import { Curriculum, CurriculumSubjects, SectionOnSubject, Subject } from "@prisma/client";

const SectionTable = ({ sections, sectionsIsLoading }: {
    sections: (SectionOnSubject & {
        curriculum: {
            curriculum: Curriculum,
            subject: Subject
        }
    })[] | undefined;
    sectionsIsLoading: boolean;
}) => {
    const router = useRouter()
    const [pagination, setPagination] = useState<PaginationType>({
        take: 5,
        skip: 0
    })

    return (

        <div className=" rounded-md shadow overflow-hidden h-full flex flex-col justify-between pt-0 bg-background border">
            <Table className=" border-b">
                <TableHeader className=" bg-secondary">
                    <TableRow>
                        <TableHead className=" w-[200px]">Section Name</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead className=" md:w-[120px]  xl:w-[150px] w-[100px]">Type</TableHead>
                        <TableHead className=" md:w-[120px]  xl:w-[150px] w-[100px]">School Year</TableHead>
                        <TableHead className=" md:w-[120px]  xl:w-[150px] w-[100px]">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sections?.sort((secA, secB) => secA.curriculum.subject.code.localeCompare(secB.curriculum.subject.code)).slice(pagination.skip, pagination.skip + pagination.take).map((section) => (
                        <TableRow
                            key={section.id}
                        // className={`cursor-pointer ${params?.[0] === subject.id.toString() && "bg-primary-foreground"}`}
                        // onClick={() => navigateToViewSubject(`${subject.id}/${subject.InstructorOnSubject[0]?.id}/${subject.subject.code}/${subject.subject.title}/${subject.subject.type}/${subject.curriculum.courseCode}`)}
                        >
                            <TableCell className=" w-[200px]">
                                <p className=" text-base font-bold">{section.section_name}</p></TableCell>
                            <TableCell><div className=" flex flex-col">
                                <p className=" text-base font-bold">{section.curriculum.subject.code}</p>
                                <p>{section.curriculum.subject.title}</p>
                            </div></TableCell>
                            <TableCell className=" md:w-[120px]  xl:w-[150px] w-[100px]">
                                <Badge variant={section.curriculum.subject.type === "MINOR" ? "secondary" : "default"} className=" text-xs px-2 inline">{section.curriculum.subject.type}</Badge>
                            </TableCell>
                            <TableCell className=" md:w-[120px]  xl:w-[150px] w-[100px]">
                                {section.curriculum.curriculum.school_year}
                            </TableCell>
                            <TableCell className=" md:w-[120px]  xl:w-[150px] w-[100px]">
                                <div className=" w-20 text-center" onClick={() => router.push(`/instructor/sections/section/${section.id}`)} >
                                    <p className=" text-xs font-semibold border rounded-full p-1 bg-muted hover:bg-background">View</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <TableStateAndPagination
                isLoading={sectionsIsLoading}
                data={sections || []}
                pagination={pagination}
                setPagination={setPagination}
            />
        </div>);
}

export default SectionTable;