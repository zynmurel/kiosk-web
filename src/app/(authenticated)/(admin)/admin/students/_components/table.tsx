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
import { type $Enums } from "@prisma/client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LoaderCircle, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "@/hooks/use-toast";
import { useStudentContext } from "@/lib/context/admin/student";
type Student = {
    id: number;
    courseCode: string;
    departmentCode: string;
    firstName: string;
    middleName: string | undefined | null;
    lastName: string;
    redeemedPoints: number;
    contact: string | undefined | null;
    email: string | undefined | null;
    studentID: string;
    password: string;
    status: $Enums.student_status;
    createdAt: Date;
    updatedAt: Date;
}
const StudentsTable = ({ students, studentsIsLoading }: {
    students: Student[] | null | undefined;
    studentsIsLoading: boolean;
}) => {
    const state = useStudentContext()
    const [idLoading, setIdLoading] = useState<number | undefined>(undefined)
    const [pagination, setPagination] = useState<PaginationType>({
        take: 10,
        skip: 0
    })

    const onEditStudent = (stud:Student) => {
        state?.setUpsertStudent({
            id: stud.id,
            courseCode:stud.courseCode,
            firstName:stud.firstName,
            middleName:stud.middleName,
            lastName:stud.lastName,
            contact:stud.contact,
            email:stud.email,
            studentID:stud.studentID,
        })
    }

    const { mutateAsync : resetPassword } = api.admin.student.resetPassword.useMutation({
        onSuccess:async () => {
            toast({
              title: "Success!",
              description: "Password reset to the default password."
            })
          },
          onError: (e) => {
            toast({
              variant: "destructive",
              title: "Creating dean failed",
              description: e.message
            })
          },
          onSettled:()=>setIdLoading(undefined)
    })
    return (
        <div className="flex flex-col h-full bg-background rounded overflow-hidden xl:col-span-3 gap-2 xl:px-5 px-2">
            
            <div className=" rounded overflow-hidden h-full flex flex-col justify-between pt-0">
                <Table className=" border-b">
                    <TableHeader className=" bg-secondary">
                        <TableRow>
                            <TableHead className=" md:w-[120px]  xl:w-[150px] w-[100px]">Student ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="hidden xl:table-cell">Email</TableHead>
                            <TableHead className="hidden xl:table-cell">Phone</TableHead>
                            <TableHead className="w-[150px] hidden md:table-cell">Course</TableHead>
                            <TableHead className="w-[100px]">Action</TableHead>
                        </TableRow>
                    </TableHeader> 
                    <TableBody>
                        {students?.slice(pagination.skip, pagination.skip + pagination.take).map((student) => (
                            <TableRow
                                key={student.id}
                                className={`cursor-pointer`}
                            >
                                <TableCell className=" md:w-[120px]  xl:w-[150px] w-[100px]">{student.studentID}</TableCell>
                                <TableCell>{`${student.firstName} ${student.middleName ? student.middleName[0]+"." : ""} ${student.lastName}`}</TableCell>
                                <TableCell className="hidden xl:table-cell">{student.email ? student.email : <span className=" text-muted-foreground">None</span>}</TableCell>
                                <TableCell className="hidden xl:table-cell">{student.contact ? student.contact : <span className=" text-muted-foreground">None</span>}</TableCell>
                                <TableCell className="w-[150px] hidden md:table-cell">{student.courseCode}</TableCell>
                                    <TableCell className="w-[100px]">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    aria-haspopup="true"
                                                    size="icon"
                                                    variant="ghost"
                                                >
                                                    {idLoading===student.id  ? <LoaderCircle className="w-4 h-4 animate-spin"/> : <MoreHorizontal className="w-4 h-4" />}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    onClick={()=>onEditStudent(student)}
                                                >Edit</DropdownMenuItem>
                                                <DropdownMenuItem 
                                                onClick={async ()=> {
                                                    setIdLoading(student.id)
                                                    await resetPassword({id:student.id})
                                                    }}
                                                    >Reset Password</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TableStateAndPagination
                    isLoading={studentsIsLoading}
                    data={students || []}
                    pagination={pagination}
                    setPagination={setPagination}
                />
            </div>
        </div>);
}

export default StudentsTable;