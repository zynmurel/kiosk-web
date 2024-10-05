'use client'
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import Loading from "../../_components/loading";
import { activityTypes } from "@/lib/helpers/selections";
import { format } from "date-fns";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { PaginationType } from "@/lib/types/pagination";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { ActivityScores, Student, StudentBatch } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Check, Edit, RefreshCcw } from "lucide-react";

const SelectedActivity = () => {
    const { activity_id } = useParams()
    const [scores, setScores] = useState<({
        student: StudentBatch & {
            student: Student
        }
        score: number | undefined;
        id: number;
        redeemed: boolean;
        activityId: number;
        studentBatchId: number;
    })[]>([])
    const [activeEdit, setActiveEdit] = useState<number | null>(null)
    const [isPendingId, setIsPendingId] = useState<number | null>(null)
    const { data: activity, isLoading: activityIsLoading, isRefetching, refetch } = api.instructor.section.getActivity.useQuery({
        activityId: Number(activity_id)
    }, {
        enabled: !Number.isNaN(Number(activity_id))
    })
    const { mutateAsync, isPending} = api.instructor.section.updateActivityScore.useMutation({
    })

    useEffect(() => {
        if (activity) {

            setScores(activity.ActivityScores || [])
        }
    }, [activity])

    if (activityIsLoading) {
        return <div className=" flex items-center justify-center py-20 text-muted-foreground"><Loading /></div>
    }

    if (!activity) {
        return <div className=" flex items-center justify-center py-40 text-muted-foreground">No Activity Found</div>
    }

    const onSave = async (id:number, score:number) => {
        setIsPendingId(id)
        setActiveEdit(null)
        await mutateAsync({
            activityScoreId :id,
            score:score
        })
    }

    const onChangeInput = (id: number, value: string, totalPossible:number) => {
        setScores(prev => prev.map((score) => {
            if (score.id === id && Number(value)<=totalPossible && Number(value)>=0) {
                return {
                    ...score,
                    score: value ? Number(value) : undefined
                }
            }
            return score
        }))
    }

    return (
        <div className=" flex md:flex-col gap-1">
            <div className=" flex flex-col md:flex-row gap-5 md:items-end justify-between py-2 w-full">
                <div className=" flex flex-col gap-0 md:items-start items-center">
                    <div>{format(activity.createdAt, "PPPP")}</div>
                    <div>{activityTypes.find(at => at.value === activity.activity_type)?.label}</div>
                    <div className=" capitalize text-xl md:text-3xl xl:text-4xl">{activity.title}</div>
                    <div className=" capitalize text-base font-normal text-muted-foreground">{activity.description}</div>
                </div>
                <div className=" flex flex-col items-center justify-center gap-1 border rounded p-3">
                    <div className=" text-2xl">{activity.totalPossibleScore}</div>
                    <div>Highest Possible Score</div>
                </div>
            </div>
            <div className=" flex flex-row justify-end">

            </div>
            <Table className=" border rounded mb-5">
                <TableHeader className=" bg-secondary">
                    <TableRow>
                        <TableHead className="w-[100px]">No.</TableHead>
                        <TableHead className="w-[150px]">ID</TableHead>
                        <TableHead className="">Student</TableHead>
                        <TableHead className="w-[200px]">
                            <div className=" flex flex-row w-full justify-between items-center">Score
                            <Button variant={"outline"} size={"icon"} onClick={async()=>await refetch()}><RefreshCcw className={`w-4 ${isRefetching && "animate-spin"}`}/></Button></div>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {scores.map((score, index) => {
                        const { firstName, lastName, middleName, studentID } = score.student.student
                        return (
                            <TableRow
                                key={score.id}
                            >
                                <TableCell className="w-[50px]">
                                    {index + 1}
                                </TableCell>
                                <TableCell className="w-[100px]">
                                    {studentID}
                                </TableCell>
                                <TableCell className="">
                                    {`${lastName}, ${firstName} ${middleName?.[0] ? middleName?.[0] + "." : ""}`}
                                </TableCell>
                                <TableCell className="w-[200px] flex flex-row items-center gap-2" >
                                    <Input max={100} type="number" disabled={activeEdit !== score.id} value={score.score} onChange={(e) => onChangeInput(score.id, e.target.value, activity.totalPossibleScore)} />
                                    {
                                        activeEdit === score.id ?
                                            <Button size={"icon"} disabled={!(Number(score.score)<=activity.totalPossibleScore && Number(score.score)>=0)} onClick={()=>onSave(score.id, score.score || 0)} className=" p-2 bg-green-500 hover:bg-green-700"><Check size={20} /></Button>
                                            : <Button size={"icon"} disabled={isPending && score.id === isPendingId}  onClick={() => setActiveEdit(score.id)} variant={"outline"} className=" p-2"><Edit size={20} /></Button>
                                    }
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    );
}

export default SelectedActivity;