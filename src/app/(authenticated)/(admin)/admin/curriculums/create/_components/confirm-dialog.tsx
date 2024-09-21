'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { type z } from "zod";
import { type SubjectsSelectedType
 } from "../page";
import { api } from "@/trpc/react";
import { useStore } from "@/lib/store/app";
import { semesters, studentYear } from "@/lib/helpers/selections";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

export function ConfirmDialog({ open, setOpen, onConfirm, createCurriculumIsPending }: {
    open: {
    courseCode: string;
    schoolYear: string;
    studentYear: number;
    semester: number;
} & { subjects: SubjectsSelectedType[] } | undefined;
    setOpen: (e: boolean) => void;
    createCurriculumIsPending: boolean;
    onConfirm: (data:{
    courseCode: string;
    schoolYear: string;
    studentYear: number;
    semester: number;
} & { subjects: SubjectsSelectedType[] }) => Promise<void>
}) {
    const { user } = useStore()

    const { data: subjects } = api.admin.global.getSelectableSubjects.useQuery({
        departmentCode: user?.department || "",
    }, {
        enabled: false
    })

    const totalUnits = open?.subjects?.reduce((acc, curr) => {
        const unit = subjects?.find((subj => subj.id === curr.subjectId))?.units
        return acc + (unit || 0)
    }, 0)

    return (
        <Dialog open={!!open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Confirm</DialogTitle>
                    <DialogDescription>
                        Confirm adding curriculum to this course.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className=" flex flex-row justify-between items-end">
                        <p className=" text-5xl font-bold">{open?.courseCode}</p>
                        <p className=" text-2xl font-semibold">{open?.schoolYear}</p>
                    </div>
                    <div className=" flex flex-row justify-between items-end">
                        <p className=" capitalize">Year Level : <span className=" font-semibold">{studentYear.find((sy) => sy.value === open?.studentYear)?.label}</span></p>
                        <p className=" capitalize">Semester : <span className=" font-semibold">{semesters.find((sy) => sy.value === open?.semester)?.label}</span></p>
                    </div>
                    <div>
                        <Table className=" bg-background rounded-md border shadow-md">
                            <TableHeader className="">
                                <TableRow>
                                    <TableHead>Subject Code</TableHead>
                                    <TableHead className="w-[100px] text-center">Units</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {open?.subjects.map((sub) => {
                                    const subject = subjects?.find((subj => subj.id === sub.subjectId))
                                    return (
                                        <TableRow key={sub.subjectId} className=" p-0">
                                            <TableCell className=" py-2"><p className="font-bold p-0">{subject?.code}</p></TableCell>
                                            <TableCell className="text-center py-2">{subject?.units}</TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell className=" py-2 font-bold">Total Units</TableCell>
                                    <TableCell className="text-center py-2">{totalUnits}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                    <div className=" flex flex-row gap-2 w-full justify-end">
                        <Button onClick={() => setOpen(false)} type="button" variant={"outline"} className=" flex flex-row  items-center gap-1">
                            Cancel
                        </Button>
                        <Button disabled={createCurriculumIsPending} onClick={async()=>{ 
                            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                            !!open && await onConfirm(open)
                            }} variant={"default"} className=" flex flex-row  items-center gap-1">
                            <ArrowUpRight size={18} /><span>Confirm</span>
                        </Button>
                    </div>

                </div>
            </DialogContent>
        </Dialog >
    )
}
