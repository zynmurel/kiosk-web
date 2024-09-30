'use client'
import { useStore } from "@/lib/store/app";
import { api } from "@/trpc/react";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import Loading from "./loading";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AttendanceTable } from "./attendance-table";
const AttendanceNow = () => {

    const { id } = useParams()
    const { user } = useStore()
    const dateNow = format(new Date(), "PPPP")

    const { data: section, isPending: sectionIsLoading, refetch } = api.instructor.section.getSection.useQuery({
        id: Number(id),
        instructorId: Number(user?.id)
    }, {
        enabled: false
    })

    const { mutateAsync: createAttendance, isPending: createAttendanceIsPending } = api.instructor.section.createAttendance.useMutation({
        onSuccess: async () => {
            toast({
                title: "Attendance Created!",
                description: "Now you can add attendance records of your student"
            })
            await refetch()
        },
        onError: (e) => {
            if (e.message.includes("Unique constraint failed on the fields")) {
                toast({
                    variant: "destructive",
                    title: "Duplicate Attendance",
                    description: "Attedance for this day is already created."
                })
            } else {
                toast({
                    variant: "destructive",
                    title: "Creating attendance failed",
                    description: e.message
                  })
          }
        }})


    return (
        <div className="px-1 rounded relative font-normal min-h-32 mb-3">
            {
                (sectionIsLoading || createAttendanceIsPending) ?
                    <div className=" absolute bg-background opacity-50 z-10 top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                        <Loading />
                    </div> : <div>
                        {
                            !section?.Attendances[0] ?
                                <div>
                                    <div className=" flex justify-center items-center flex-col gap-2 py-10">
                                        <p className="">No Attendace Created for <span className=" font-semibold text-orange-600">{dateNow}</span></p>
                                        <Button  onClick={()=>createAttendance({sectionId : section?.id || 0})}  disabled={!section || createAttendanceIsPending} className=" gap-1"><PlusCircle size={18}/>Create Attendance</Button>
                                    </div>
                                </div> :
                                <div>
                                    <p className=" font-bold text-lg">Attendance for <span className=" font-semibold text-orange-600">{dateNow}</span></p>
                                    <div style={{ height : "60vh"}} className=" overflow-auto">

                                    <AttendanceTable students={section.Batch} attendance={section.Attendances[0]}/>
                                    </div>
                                </div>
                        }
                    </div>}

        </div>
    );
}

export default AttendanceNow;