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
import { useStore } from "@/lib/store/app"
import { useEffect, useState } from "react"
import { toast } from "@/hooks/use-toast"
import Loading from "../_components/loading"


const SettingsPage = () => {
    const { user } = useStore()
    const [employeeId, setEmployeeId] = useState({
        id: 0,
        employeeID: ""
    })
    const [employeePassword, setEmployeePassword] = useState({
        id: 0,
        isChangesPass: false,
        password: {
            value: "",
            show: false
        },
        newPassword: {
            value: "",
            show: false
        },
        confirmNewPassword: {
            value: "",
            show: false
        },
    })
    const { data: settings, isPending } = api.super.settings.getAccountDetails.useQuery({
        id: user?.id || 0
    }, {
        enabled: !!user?.id
    })

    const onSuccess = ({ description }: { description: string }) => {
        toast({
            title: "Saved!",
            description
        })
    }

    const { mutate: updateEmployeeID, isPending: updateEmployeeIDIsPending } = api.super.settings.updateEmployeeID.useMutation({
        onSuccess: () => onSuccess({ description: "Employee ID updated successfully." })
    })

    const { mutate: updateSuperAdminPass, isPending: updateSuperAdminPassIsPending } = api.super.settings.updateSuperAdminPass.useMutation({
        onSuccess: () => {
            onSuccess({ description: "Password reset to default password." })
            setEmployeePassword({
                id: 0,
                isChangesPass: false,
                password: {
                    value: "",
                    show: false
                },
                newPassword: {
                    value: "",
                    show: false
                },
                confirmNewPassword: {
                    value: "",
                    show: false
                },
            })
        },
        onError : (e) => {
            toast({
                variant:"destructive",
                title : "Failed",
                description : e.message
            })
        }
    })

    const onChangePassword = () => {
        if(employeePassword.newPassword.value.length < 8 || employeePassword.password.value.length < 8 ) {
        toast({
            variant:"destructive",
            title: "Input Error!",
            description : "Password must be longer than 8 characters."
        })
        }else if(employeePassword.newPassword.value !== employeePassword.confirmNewPassword.value){
            toast({
                variant:"destructive",
                title: "Input Error!",
                description : "Password does not match."
            })
        }else{
            updateSuperAdminPass({
                id:employeePassword.id,
                password:employeePassword.password.value,
                newPassword:employeePassword.newPassword.value
            })
        }
    }

    useEffect(() => {
        if (settings) {
            const {
                id,
                employeeID,
            } = settings
            setEmployeeId({
                id,
                employeeID,
            })
            setEmployeePassword(prev=>({
                ...prev,
                id
            }))
        }
    }, [settings])
    return (
        <div className="grid gap-6">
            <Card x-chunk="dashboard-04-chunk-1" className=" xl:w-4/5 relative">
                {(isPending) &&
                    <div className=" absolute bg-background bg-opacity-50 z-10 top-0 left-0 right-0 bottom-0 flex items-center justify-center" style={{ opacity: .5 }}>
                        <Loading />
                    </div>}
                <CardHeader>
                    <CardTitle>Employee ID ( Super Admin )</CardTitle>
                    <CardDescription>
                        This is the employee ID of the super admin.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className=" flex md:flex-row items-center gap-4">
                        <div className=" flex-1">
                            <div className=" text-sm">Employee ID</div>
                            <Input value={employeeId.employeeID} onChange={(e) => setEmployeeId(prev => ({ ...prev, employeeID: (e.target.value) }))} placeholder="Employee ID" />
                        </div>

                    </div>

                </CardContent>
                <CardFooter className="border-t px-6 py-4 flex justify-end">
                    <Button disabled={updateEmployeeIDIsPending} onClick={() => updateEmployeeID({
                        ...employeeId
                    })}>Save</Button>
                </CardFooter>
            </Card>

            <Card x-chunk="dashboard-04-chunk-1" className=" xl:w-4/5 relative">
                {(isPending) &&
                    <div className=" absolute bg-background bg-opacity-50 z-10 top-0 left-0 right-0 bottom-0 flex items-center justify-center" style={{ opacity: .5 }}>
                        <Loading />
                    </div>}
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                        Change password settings for super admin.
                    </CardDescription>
                </CardHeader>
                {
                    employeePassword.isChangesPass ?
                        <CardContent className=" space-y-5">
                        <div>
                            <div className=" text-sm">Password</div>
                            <div className=" w-full flex flex-row gap-2 items-center">
                                <Input type={employeePassword.password.show ? "text" : "password"}
                                    className=" xl:w-[400px]"
                                    value={employeePassword.password.value}
                                    onChange={(e) => setEmployeePassword(prev => ({
                                        ...prev, password: {
                                            ...prev.password,
                                            value: e.target.value
                                        }
                                    }))} placeholder="Input password" />
                                <div
                                    onClick={() => setEmployeePassword(prev => ({
                                        ...prev, password: {
                                            ...prev.password,
                                            show: !prev.password.show
                                        }
                                    }))}
                                    className=" text-sm text-gray-600 cursor-pointer"
                                >{employeePassword.password.show ? "Hide" : "Show"}</div>
                            </div>
                        </div>
                            <div>
                                <div className=" text-sm">New Password</div>
                                <div className=" w-full flex flex-row gap-2 items-center">
                                    <Input type={employeePassword.newPassword.show ? "text" : "password"}
                                        className=" xl:w-[400px]"
                                        value={employeePassword.newPassword.value}
                                        onChange={(e) => setEmployeePassword(prev => ({
                                            ...prev, newPassword: {
                                                ...prev.newPassword,
                                                value: e.target.value
                                            }
                                        }))} placeholder="Input new password" />
                                    <div
                                        onClick={() => setEmployeePassword(prev => ({
                                            ...prev, newPassword: {
                                                ...prev.newPassword,
                                                show: !prev.newPassword.show
                                            }
                                        }))}
                                        className=" text-sm text-gray-600 cursor-pointer"
                                    >{employeePassword.newPassword.show ? "Hide" : "Show"}</div>
                                </div>
                            </div>
                            <div>
                                <div className=" text-sm">Confirm Password</div>
                                <div className=" w-full flex flex-row gap-2 items-center">
                                    <Input type={employeePassword.confirmNewPassword.show ? "text" : "password"}
                                        className=" xl:w-[400px]"
                                        value={employeePassword.confirmNewPassword.value}
                                        onChange={(e) => setEmployeePassword(prev => ({
                                            ...prev, confirmNewPassword: {
                                                ...prev.confirmNewPassword,
                                                value: e.target.value
                                            }
                                        }))} placeholder="Input password" />
                                    <div
                                        onClick={() => setEmployeePassword(prev => ({
                                            ...prev, confirmNewPassword: {
                                                ...prev.confirmNewPassword,
                                                show: !prev.confirmNewPassword.show
                                            }
                                        }))}
                                        className=" text-sm text-gray-600 cursor-pointer"
                                    >{employeePassword.confirmNewPassword.show ? "Hide" : "Show"}</div>
                                </div>
                            </div>
                        </CardContent> :
                        <div>

                        </div>
                }

                <CardFooter className="border-t px-6 py-4 flex justify-end">
                    {
                        employeePassword.isChangesPass ? <div className=" flex flex-row gap-1">
                            <Button variant={"outline"} onClick={() => setEmployeePassword(prev => ({ ...prev, isChangesPass: false }))}>Cancel</Button>
                            <Button disabled={updateSuperAdminPassIsPending} onClick={() => onChangePassword()}>Save</Button>
                        </div> :
                            <Button onClick={() => setEmployeePassword(prev => ({ ...prev, isChangesPass: true }))}>Change</Button>
                    }
                </CardFooter>
            </Card>
        </div>
    );
}

export default SettingsPage;