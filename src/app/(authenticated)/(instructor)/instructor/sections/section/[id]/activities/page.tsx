'use client'

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const activityTypes = [{
    value: "ALL",
    label: "ALL"
}, {
    value: "EXAM",
    label: "EXAM"
}, {
    value: "QUIZ",
    label: "QUIZ"
}, {
    value: "ASSIGNMENT",
    label: "ASSIGNMENT"
}, {
    value: "PROJECT",
    label: "PROJECT"
}, {
    value: "OTHERS",
    label: "OTHERS"
}, {
    value: "MAJOR_EXAM",
    label: "MAJOR EXAM"
}, {
    value: "MAJOR_COURSE_OUTPUT",
    label: "MAJOR COURSE OUTPUT"
}]
type ActivityTypeTypes = "ALL" | "MAJOR_EXAM" | "MAJOR_COURSE_OUTPUT" | "EXAM" | "QUIZ" | "ASSIGNMENT" | "PROJECT" | "OTHERS"
const FormSchema = z.object({ 
    sectionId: z.number(),
    title: z.string(),
    description : z.string().optional(),
    settedRedeemablePoints : z.number().optional(),
    totalPossibleScore : z.number(),
    activity_type : z.enum(["MAJOR_EXAM" , "MAJOR_COURSE_OUTPUT" , "EXAM" , "QUIZ" , "ASSIGNMENT" , "PROJECT" , "OTHERS"])
  })
const Attendance = () => {
    const [activityType, setActivityType] = useState<ActivityTypeTypes>("ALL")
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })


    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data)
    }
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
                    <Button className=" gap-1"><Plus className=" w-5 -ml-1" />New Activity</Button>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex items-center justify-center flex-col">

                </form>
            </Form>
        </div>);
}

export default Attendance;