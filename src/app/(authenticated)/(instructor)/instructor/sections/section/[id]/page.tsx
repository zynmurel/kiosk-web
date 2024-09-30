'use client'
import { useState } from "react";
import { Card, CardContent, CardHeader, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {Trash } from "lucide-react";
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
import { type PaginationType } from "@/lib/types/pagination";

const Page = () => {
    const [selectedStudents, setSelectedStudents] = useState<AvailableStudentsType[]>([])
    const [pagination, setPagination] = useState<PaginationType>({
        take: 10,
        skip: 0
    })

    return (

        <Card x-chunk="dashboard-04-chunk-1" className=" w-full relative p-0">
            <CardHeader className=" py-2 items-center px-5 font-semibold bg-muted flex flex-row justify-between">Overview
            </CardHeader>
            <CardContent className=" py-2 px-5 font-semibold flex flex-col">
                {
                    !selectedStudents.length ? <></> : <>
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
                                            <Button onClick={() => setSelectedStudents((prev) => prev.filter(p => p.id !== student.id))} type="button" variant={"destructive"} size={"sm"}>
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