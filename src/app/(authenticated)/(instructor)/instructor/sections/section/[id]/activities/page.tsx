'use client'

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { MoreHorizontal, Plus } from "lucide-react";
import { useState } from "react";
import { NewActivityDialog } from "./_components/new-activity-dialog";
import { api } from "@/trpc/react";
import { useParams, useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { PaginationType } from "@/lib/types/pagination";
import TableStateAndPagination from "./_components/table-components/table-footer";
import { format } from "date-fns";
import NoFound from "../_components/table-components/no-found";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { activityTypes } from "@/lib/helpers/selections";
type ActivityTypeTypes = "ALL" | "MAJOR_EXAM" | "MAJOR_COURSE_OUTPUT" | "EXAM" | "QUIZ" | "ASSIGNMENT" | "PROJECT" | "OTHERS"
const Attendance = () => {
    const router = useRouter()
    const { id } = useParams()
    const [activityType, setActivityType] = useState<ActivityTypeTypes>("ALL")
    const [open, setOpen] = useState(false)
    const [pagination, setPagination] = useState<PaginationType>({
        take: 10,
        skip: 0
    })
    const { data: activities, isLoading: activitiesIsLoading, refetch } = api.instructor.section.getActivities.useQuery({
        sectionId: Number(id),
    }, {
        enabled: !Number.isNaN(Number(id))
    })

    const refetchActivities = async () => {
        await refetch()
    }

    const filteredActivities = activityType === "ALL" ? activities : activities?.filter((act) => act.activity_type === activityType)

    return (
        <div className=" flex flex-col gap-5 py-2">
            <div className=" flex flex-row gap-5 justify-between items-end">
                <div className=" text-sm md:text-base xl:text-lg">List of Activities</div>
                <div className=" flex flex-row gap-2">
                    <Select onValueChange={(e) => setActivityType(e as ActivityTypeTypes)} defaultValue={activityType}>
                        <SelectTrigger className=" md:w-[250px]">
                            <SelectValue placeholder={"Selecte Activity Type"} />
                        </SelectTrigger>
                        <SelectContent className=" w-[250px]">
                            {
                                activityTypes?.map((course) => <SelectItem key={course.value} value={course.value}><span className="text-start text-nowrap">{course.label}</span></SelectItem>)
                            }
                        </SelectContent>
                    </Select>
                    <Button onClick={() => setOpen(true)} className=" gap-1"><Plus className=" w-5 -ml-1" />New Activity</Button>
                </div>
            </div>


            <Table className=" border-b">
                <TableHeader className=" bg-secondary">
                    <TableRow>
                        <TableHead className=" md:w-[120px]  xl:w-[150px] w-[100px]">Date</TableHead>
                        <TableHead className="">Title</TableHead>
                        <TableHead className="">Type</TableHead>
                        <TableHead className="w-[100px]">HPS</TableHead>
                        <TableHead className="w-[100px]">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredActivities?.slice(pagination.skip, pagination.skip + pagination.take).map((activity) => (
                        <TableRow
                            key={activity.id}
                        >
                            <TableCell className=" md:w-[120px]  xl:w-[150px] w-[100px]">
                                {format(activity.createdAt, "PP")}
                            </TableCell>
                            <TableCell className="">
                                {activity.title}
                            </TableCell>
                            <TableCell className="">
                                {activityTypes.find(at => at.value === activity.activity_type)?.label}
                            </TableCell>
                            <TableCell className="w-[100px]">
                                {activity.totalPossibleScore}
                            </TableCell>
                            <TableCell className="w-[100px]">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            aria-haspopup="true"
                                            size="icon"
                                            variant="ghost"
                                        >
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem
                                            onClick={() => router.push(`activities/${activity.id}`)}
                                        >View</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {!filteredActivities?.length && !activitiesIsLoading && <NoFound />}
            <TableStateAndPagination
                isLoading={activitiesIsLoading}
                data={activities || []}
                pagination={pagination}
                setPagination={setPagination}
            />
            <NewActivityDialog open={open} setOpen={setOpen} refetchActivities={refetchActivities} />
        </div>);
}

export default Attendance;