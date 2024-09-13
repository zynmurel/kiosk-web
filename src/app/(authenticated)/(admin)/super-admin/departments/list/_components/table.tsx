'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { PlusCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import TableStateAndPagination from "./table-components/table-footer";
import { PaginationType } from "@/lib/types/pagination";
import { useEffect, useState } from "react";
import { api } from "@/trpc/react";

const DepartmentTable = () => {
    const router = useRouter()
    const { id } = useParams()
    const [pagination, setPagination] = useState<PaginationType>({
        take: 10,
        skip: 0
    })
    const { data:departments, isLoading:departmentsIsLoading } = api.department.getAllDepartments.useQuery()

    const navigateToAddDept = (path: string | number) => () => router.push("/super-admin/departments/upsert/" + path)
    const navigateSelectDept = (path: string | number) => () => router.push("/super-admin/departments/list/" + path)

    return (
        <Card>
            <CardContent className=" p-4 flex flex-col">
                <div className=" flex justify-between flex-row px-3 items-center">
                    <p className=" font-semibold text-lg">List of Departments</p>
                    <Button size="sm" className="gap-1" variant={"outline"} onClick={navigateToAddDept("new")}>
                        <PlusCircle className="h-4 w-4" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add Department
                        </span>
                    </Button>
                </div>
                <Separator className="my-3" />
                <div className=" border rounded overflow-hidden">
                    <Table className="">
                        <TableHeader className=" bg-secondary">
                            <TableRow>
                                <TableHead className="w-[100px]">Code</TableHead>
                                <TableHead>Title</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {departments?.map((department) => (
                                <TableRow 
                                key={department.id} 
                                className={`hover:bg-primary-foreground cursor-pointer ${Number(id)===department.id && "bg-primary-foreground"} `}
                                onClick={navigateSelectDept(department.id)}
                                >
                                    <TableCell className="font-medium">{department.code}</TableCell>
                                    < TableCell>{department.title}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <TableStateAndPagination
                    isLoading={departmentsIsLoading}
                    data={departments || []}
                    pagination={pagination}
                    setPagination={setPagination}
                />
            </CardContent>
        </Card>);
}

export default DepartmentTable;