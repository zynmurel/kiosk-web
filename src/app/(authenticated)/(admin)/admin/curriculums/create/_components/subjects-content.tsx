import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { type SubjectsSelectedType } from "../page";
import { Plus, Trash } from "lucide-react";
import { useStore } from "@/lib/store/app";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { type Dispatch, type SetStateAction } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
const SubjectContents = ({ subjectsSelected, onRemoveSubject, setIsAddSubject }: {
    subjectsSelected: SubjectsSelectedType[] | undefined;
    onRemoveSubject: (id: number) => void;
    setIsAddSubject: Dispatch<SetStateAction<boolean>>
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
            <div className=" p-2 border rounded-lg bg-muted flex flex-col space-y-2">
                {
                    !subjectsSelected?.length ?
                        <div className=" bg-muted text-muted-foreground flex items-center justify-center flex-col w-full p-10 border border-muted-foreground opacity-60 rounded border-dashed">
                            <Plus size={36} />
                            <p className=" text-center">Add subjects to your new curriculum</p>
                        </div> :
                        <Table className=" bg-background rounded-md">
                            <TableHeader className="">
                                <TableRow>
                                    <TableCell className="w-[50px] text-center"></TableCell>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Instructor</TableHead>
                                    <TableCell className="w-[100px] text-center">Units</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {subjectsSelected.map((sub) => {
                                    const subject = subjects?.find((subj => subj.id === sub.subjectId))
                                    const assignInstructors = instructors?.filter((instructor => sub.instructorIds.includes(instructor.id)))
                                    return (
                                        <TableRow key={sub.subjectId}>
                                            <TableCell>
                                                <Button onClick={() => onRemoveSubject(sub.subjectId)} type="button" variant={"destructive"} size={"sm"}>
                                                    <Trash size={16} />
                                                </Button>
                                            </TableCell>
                                            <TableCell><p className=" text-lg font-bold">{subject?.code}</p><p>{subject?.title}</p></TableCell>
                                            <TableCell>
                                                <Popover>
                                                    <PopoverTrigger>{assignInstructors?.length || 0} Instructor/s</PopoverTrigger>
                                                    <PopoverContent>
                                                        <div className=" text-sm">
                                                            {assignInstructors?.length ?
                                                                assignInstructors.map((instructor) => {
                                                                    return <div key={instructor.id}>{`${instructor.employeeID} - ${instructor.firstName} ${instructor.firstName} ${instructor.firstName}`}</div>
                                                                }) : <div className=" text-center text-muted-foreground">No Instructor Assigned</div>
                                                            }
                                                        </div>
                                                    </PopoverContent>
                                                </Popover></TableCell>
                                            <TableHead className="text-center">{subject?.units}</TableHead>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={3}>Total Units</TableCell>
                                    <TableCell className="text-center">{totalUnits}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                }
                <Button onClick={() => setIsAddSubject(true)} type="button" variant={"outline"} className="flex self-end flex-row px-5 items-center gap-1">
                    <Plus strokeWidth={2.5} size={16} /> <span>Add Subject</span>
                </Button>
            </div>
        </div>);
}

export default SubjectContents;