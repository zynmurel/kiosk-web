'use client'
import { addDays, eachDayOfInterval, endOfDay, format } from "date-fns";
import React, { useEffect, useState } from "react";
import {type DateRange } from "react-day-picker";
import { DatePickerWithRange } from "./rangepicker";
import { Separator } from "@/components/ui/separator";
import { Check, X } from "lucide-react";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import { useStore } from "@/lib/store/app";
import Loading from "./loading";

const AttendanceRecord = () => {
    const { id } = useParams()
    const { user } = useStore()
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: endOfDay(addDays(new Date(), 30),)
    })
    const [days, setDays] = useState<Date[]>([])

    const { data: records, isPending: recordsIsLoading } = api.instructor.section.getAttendanceRecord.useQuery({
        sectionOnSubjectId: Number(id),
        instructorId: Number(user?.id),
        from : (days[0] || new Date()),
        to : (days[days.length-1] || new Date())
    }, {
        enabled: !Number.isNaN(Number(id) + Number(user?.id)) && !!days.length
    })

    useEffect(() => {
        if (!!date?.from && !!date.to) {
            setDays(eachDayOfInterval({ start: date.from, end: endOfDay(date.to) }))
        }
    }, [date])

    const tableHeaders = days.map((date) => ({
        label: format(date, "dd/MM/yy"),
        key: date.toString(),
        date :format(date, "dd/MM/yyyy")
    }))
    return (
        <div className=" grid w-full gap-5">
            <div className=" flex flex-col md:flex-row justify-between items-center text-xl"><p>Filter Attendance Date</p><DatePickerWithRange date={date} setDate={setDate} /></div>
            <div className=" grid grid-cols-5 border rounded-md overflow-hidden relative mb-5">
                {
                    recordsIsLoading && <div className=" absolute bg-background opacity-90 z-10 top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                    <Loading />
                </div>
                }
                <div className=" flex items-end justify-center text-sm md:text-lg lg:text-xl px-10 text-center -mb-6">Attendance Record</div>
                <div className=" overflow-auto col-span-4 bg-muted">
                <div className=" w-full p-5 flex justify-center items-center text-xl">{format(days?.[0] || new Date(),"PP")} to {format(days?.[days.length-1] || new Date(),"PP")}</div>
                </div>
                <div className=" flex justify-center flex-col font-normal text-sm">
                    <div className=" h-12 border-b flex items-end justify-center font-bold">
                        
                    </div>
                    <div className=" bg-muted">
                        {
                            records?.map((rec, index)=>{
                                return (
                                    <div key={index} className=" whitespace-nowrap dark:border-slate-700 overflow-hidden h-6 border-b px-1">{rec.student.lastName}, {rec.student.firstName}</div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className=" overflow-auto col-span-4">
                    <div className=" flex flex-row font-normal h-16 border-b">
                        
                        {
                            tableHeaders.map((header, index) => {
                                const dates = header.label.split("/")
                                return (<div  key={index} className="flex border-l dark:border-slate-700 border-0t  bg-muted flex-col text-xs min-w-8 justify-center items-center px-1">
                                    <span>{dates[0]}</span>
                                    <Separator className=" dark:bg-slate-700" />
                                    <span>{dates[1]}</span>
                                    <Separator className=" dark:bg-slate-700" />
                                    <span>{dates[2]}</span>
                                </div>)
                            })
                        }
                    </div>
                    <div className=" flex flex-col text-sm font-normal">
                        {
                            records?.map((rec, index)=>{
                                const attendanceDates = rec.section.Attendances.map((date)=>date.date)
                                const attendances = rec.AttedanceScore.map((score)=>({
                                    present : score.present,
                                    date : score.attendance.date
                                }))
                                return (
                                    <div key={index} className=" flex flex-row font-normal h-6 border-b">
                        
                                    {
                                        tableHeaders.map((header, index) => {
                                            const isIncluded = attendanceDates.includes(header.date)
                                            const isPresent = attendances.find((score)=>score.date===header.date)?.present
                                            return (<div key={index} className="flex flex-col text-xs min-w-8 justify-center items-center">
                                               {
                                                isIncluded ? <div className=" border-l flex items-center justify-center w-full h-full">
                                                    {
                                                        isPresent ? <Check size={15} className=" rounded-full bg-green-500"/> : <X size={15} className=" rounded-full bg-red-500"/>
                                                    }
                                                </div> : 
                                                <div className=" border-l flex items-center justify-center w-full h-full"></div>
                                               }
                                            </div>)
                                        })
                                    }
                                </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AttendanceRecord;