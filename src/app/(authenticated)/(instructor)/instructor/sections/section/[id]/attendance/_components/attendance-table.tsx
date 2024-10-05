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
import { type Student, type AttedanceScore, type StudentBatch, type Attendance } from '@prisma/client';
import { LoaderCircle } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

export function AttendanceTable({ students, attendance, setStudents }: {
    attendance: Attendance;
    setStudents: Dispatch<SetStateAction<({
        student: Student;
    } & {
        AttedanceScore: AttedanceScore[];
    } & {
        id: number;
        studentId: number;
        sectionId: number;
    })[]>>;
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
            studentID: student.student.studentID,
            studentId: student.student.id
        }
    }).sort((a, b) => a.name.localeCompare(b.name)).map((data, index) => ({ ...data, number: index + 1 }))
    const [loadingIds, setLoadingIds] = useState<number[]>([])

    const { mutateAsync: onCreateStudentAttendance } = api.instructor.section.onCreateAttendanceForStudent.useMutation({
        onSuccess: (data, a) => {
            setLoadingIds(prev=>prev.filter((d)=>d!==a.studentBatchId))
        },
        onError: (e, a) => {
            setLoadingIds(prev=>prev.filter((d)=>d!==a.studentBatchId))
            if (e.message.includes("Unique constraint failed on the fields")) {
                console.log(e)
            } else {
                toast({
                    variant: "destructive",
                    title: "An Error Occur",
                    description: "Please check your internet connection."
                })
            }
        },
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
                        <TableCell className="text-center w-[100px] flex items-center justify-center">
                            {
                                <Checkbox disabled={loadingIds.includes(student.id.studentBatchId)} checked={student.isPresent} onCheckedChange={async (e) => {
                                    setLoadingIds(prev=>[...prev, student.id.studentBatchId])
                                    setStudents(() => {
                                        return students.map((stud) => {
                                            if (student.studentId === stud.student.id) {
                                                return {
                                                    ...stud,
                                                    AttedanceScore: [{
                                                        present: !student.isPresent,
                                                        id: stud.AttedanceScore[0]?.id || 0,
                                                        redeemed: stud.AttedanceScore[0]?.redeemed || false,
                                                        attendanceId: stud.AttedanceScore[0]?.attendanceId || 0,
                                                        studentBatchId: stud.AttedanceScore[0]?.studentBatchId || 0,
                                                    }]
                                                }
                                            } else {
                                                return stud
                                            }
                                        })
                                    })
                                    await onCreateStudentAttendance({ ...student.id, present: e as boolean })
                                }} />
                            }
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
