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
import { SubjectsSelectedType } from "../page";
import { useStore } from "@/lib/store/app";
import { api } from "@/trpc/react";
const SubjectContents = ({ subjectsSelected }: {
    subjectsSelected: SubjectsSelectedType[] | undefined;
}) => {
    const { user } = useStore()
    const { data: instructors } = api.admin.global.getSelectableInstructors.useQuery({
        departmentCode: user?.department || "",
    }, {
        enabled: false
    })

    const { data: subjects } = api.admin.global.getSelectableSubjects.useQuery({
        departmentCode: user?.department || "",
    }, {
        enabled: false
    })

    const totalUnits = subjectsSelected?.reduce((acc, curr) => {
        const unit = subjects?.find((subj => subj.id === curr.subjectId))?.units
        return acc + (unit || 0)
    }, 0)
    return (
        <div>
            <p className="pb-1">Subjects on this Curriculum</p>
            <div className="border rounded-lg bg-muted flex flex-col space-y-2">
                <Table className=" bg-background rounded-md">
                    <TableHeader className="">
                        <TableRow>
                            <TableHead>Subject</TableHead>
                            <TableHead>Instructor</TableHead>
                            <TableCell className="w-[100px] text-center">Units</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subjectsSelected?.map((sub) => {
                            const subject = subjects?.find((subj => subj.id === sub.subjectId))
                            const instructor = instructors?.find((subj => subj.id === sub.instructorId))
                            return (
                                <TableRow key={sub.subjectId}>
                                    <TableCell><p className=" text-lg font-bold">{subject?.code}</p><p>{subject?.title}</p></TableCell>
                                    <TableCell>{instructor?.firstName} {instructor?.middleName} {instructor?.lastName}</TableCell>
                                    <TableHead className="text-center">{subject?.units}</TableHead>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={2}>Total Units</TableCell>
                            <TableCell className="text-center">{totalUnits}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </div>);
}

export default SubjectContents;