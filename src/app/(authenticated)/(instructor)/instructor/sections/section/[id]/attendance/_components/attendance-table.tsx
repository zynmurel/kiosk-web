import { Checkbox } from "@/components/ui/checkbox";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { toast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";
import {type Student,type AttedanceScore,type StudentBatch,type Attendance } from '@prisma/client';

export function AttendanceTable({ students, attendance }: {
    attendance: Attendance;
    students: ({
        student: Student;
    } & {
        AttedanceScore: AttedanceScore[];
    } & StudentBatch)[]
}) {
    const studentAttendance = students.map((student) => {
        return {
            id: {
                studentBatchId: student.id,
                attendanceId: attendance.id
            },
            isPresent: !!student.AttedanceScore[0]?.present,
            name: `${student.student.lastName}, ${student.student.firstName} ${student.student.middleName?.[0] ? student.student.middleName?.[0] + "." : ""}`,
            studentID: student.student.studentID
        }
    }).sort((a, b)=>a.name.localeCompare(b.name)).map((data,index)=>({...data, number:index+1}))

    const { mutateAsync: onCreateStudentAttendance } = api.instructor.section.onCreateAttendanceForStudent.useMutation({
        onError: (e) => {
            if (e.message.includes("Unique constraint failed on the fields")) {
                console.log(e)
            } else {
                toast({
                    variant: "destructive",
                    title: "An Error Occur",
                    description: "Please check your internet connection."
                })
          }
        }
    })
    return (
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[50px]">No.</TableHead>
                    <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-center w-[100px]">Is Present</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {studentAttendance.map((student) => (
                        <TableRow key={student.studentID}>
                            <TableCell className="w-[50px]">{student.number}</TableCell>
                            <TableCell className="w-[100px]">{student.studentID}</TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell className="text-center w-[100px]"><Checkbox defaultChecked={student.isPresent} onCheckedChange={async (e) => await onCreateStudentAttendance({ ...student.id, present: e as boolean })} /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
    )
}
