'use client'

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { api } from "@/trpc/react"
import { useEffect, useState } from "react"
import { toast } from "@/hooks/use-toast"
import Loading from "./_components/loading"


const SettingsPage = () => {
    const [password, setPassword] = useState({
        defaultPassword : "",
      show : false
    })
    const [stateSettings, setStateSettings] = useState({
        id: 0,
        defaultAttendancePoints: 0,
        defaultMajorExamPoints: 0,
        defaultMCOPoints: 0,
        defaultClassStandingPoints: 0,
        
    })
    const { data: settings, isPending } = api.super.settings.getSettings.useQuery()

    const onSuccess = ({ description }: { description: string }) => {
        toast({
            title: "Saved!",
            description
        })
    }

    const { mutate: updatePoints, isPending: updatePointsIsPending } = api.super.settings.updatePoints.useMutation({
        onSuccess: () => onSuccess({ description: "Points updated successfully." })
    })

    const { mutate: updatePassword, isPending: updatePasswordIsPending } = api.super.settings.updatePassword.useMutation({
        onSuccess: () => onSuccess({ description: "Default password updated successfully." })
    })

    useEffect(() => {
        if (settings) {
            const {
                id,
                defaultAttendancePoints,
                defaultMajorExamPoints,
                defaultMCOPoints,
                defaultClassStandingPoints,
                defaultPassword
            } = settings
            setStateSettings({
                id,
                defaultAttendancePoints,
                defaultMajorExamPoints,
                defaultMCOPoints,
                defaultClassStandingPoints,
                
            })
            setPassword((prev)=>({
                ...prev,
                defaultPassword
            }))
        }
    }, [settings])

    if (isPending) {
        // return <Loading />
    }
    return (
        <div className="grid gap-6">
        <Card x-chunk="dashboard-04-chunk-1" className=" xl:w-4/5 relative">
            {(isPending) &&
            <div className=" absolute bg-background bg-opacity-50 z-10 top-0 left-0 right-0 bottom-0 flex items-center justify-center" style={{ opacity:.5}}>
                <Loading/>
            </div>}
            <CardHeader>
                <CardTitle>Default Pointing System</CardTitle>
                <CardDescription>
                    This is the default points for each exam and attendace.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className=" flex flex-col lg:flex-row items-center gap-4">
                    <div className=" flex-1">
                        <div className=" text-sm">Attendance</div>
                        <Input type="number" value={stateSettings.defaultAttendancePoints} onChange={(e) => setStateSettings(prev => ({ ...prev, defaultAttendancePoints: Number(e.target.value) }))} placeholder="Default points for attendance" />
                    </div>
                    <div className=" flex-1">
                        <div className=" text-sm">Class Standing Activity</div>
                        <Input type="number" value={stateSettings.defaultClassStandingPoints} onChange={(e) => setStateSettings(prev => ({ ...prev, defaultClassStandingPoints: Number(e.target.value)  }))} placeholder="Default points for exams/quizzes" />
                    </div>
                    <div className=" flex-1">
                        <div className=" text-sm">Major Exam</div>
                        <Input type="number" value={stateSettings.defaultMajorExamPoints} onChange={(e) => setStateSettings(prev => ({ ...prev, defaultMajorExamPoints: Number(e.target.value)  }))} placeholder="Default points for exams/quizzes" />
                    </div>
                    <div className=" flex-1">
                        <div className=" text-sm">Major Course Output</div>
                        <Input type="number" value={stateSettings.defaultMCOPoints} onChange={(e) => setStateSettings(prev => ({ ...prev, defaultMCOPoints: Number(e.target.value)  }))} placeholder="Default points for exams/quizzes" />
                    </div>

                </div>

            </CardContent>
            <CardFooter className="border-t px-6 py-4 flex justify-end">
                <Button disabled={updatePointsIsPending} onClick={() => updatePoints({
                    defaultAttendancePoints: stateSettings.defaultAttendancePoints,
                    defaultMajorExamPoints: stateSettings.defaultMajorExamPoints,
                    defaultClassStandingPoints: stateSettings.defaultClassStandingPoints,
                    defaultMCOPoints: stateSettings.defaultMCOPoints,
                    id: stateSettings.id
                })}>Save</Button>
            </CardFooter>
        </Card>
        <Card x-chunk="dashboard-04-chunk-1" className=" xl:w-4/5 relative">
            {(isPending) &&
            <div className=" absolute bg-background bg-opacity-50 z-10 top-0 left-0 right-0 bottom-0 flex items-center justify-center" style={{ opacity:.5}}>
                <Loading/>
            </div>}
                <CardHeader>
                    <CardTitle>Default Password</CardTitle>
                    <CardDescription>
                        This is the default password for all created accounts.
                    </CardDescription>
                </CardHeader>
                <CardContent>
              <div className=" text-sm">Password</div>
                    <div className=" w-full flex flex-row gap-2 items-center">
                        <Input type={password.show ? "text" : "password"}  className=" xl:w-[400px]" value={password.defaultPassword} onChange={(e) => setPassword(prev=>({...prev, defaultPassword : e.target.value}))} placeholder="Input password" />
                        <div 
                        onClick={()=>setPassword(prev=>({...prev, show : !prev.show}))}
                        className=" text-sm text-gray-600 cursor-pointer"
                        >{password.show ? "Hide" : "Show"}</div>
                    </div>

                </CardContent>
                <CardFooter className="border-t px-6 py-4 flex justify-end">
                    <Button disabled={updatePasswordIsPending} onClick={() => updatePassword({
                        defaultPassword: password.defaultPassword,
                        id: stateSettings.id
                    })}>Save</Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default SettingsPage;