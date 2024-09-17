'use client'

import { useParams, useRouter } from "next/navigation";
import UpdateCourseForm from "../_components/update-form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { api } from "@/trpc/react";
import { useCourseContext } from "@/lib/context/course";
import { toast } from "@/hooks/use-toast";
import { useStore } from "@/lib/store/app";

const Page = () => {
    const { user } = useStore()
    const state = useCourseContext()
    const form = useFormContext()
    const router = useRouter()
    const { code } = useParams()


    const { data: selectedCourse } = api.admin.course.getCourse.useQuery({
        code: code as string
    }, {
        enabled: !!code
    })

    const { refetch: refetchCourses } = api.admin.course.getCourseByDepartment.useQuery({
        departmenCode: user?.department
    }, {
        enabled: !!user?.department
    })

    const { mutateAsync, isPending } = api.admin.course.deleteCourse.useMutation({
        onSuccess: async (data) => {
            toast({
                title: "Success!",
                description: "Course deleted."
            })
            await refetchCourses()
            if(!code) form.reset()
            router.push("/admin/courses")
        },
        onError: (e) => {
            toast({
                variant: "destructive",
                title: "Deleting course failed",
                description: e.message
            })
        }
    })

    const oncancel = () => {
        state?.setIsEdit(false)
        if (selectedCourse) {
            form.setValue("code", selectedCourse.code)
            form.setValue("title", selectedCourse.title)
        }
    }

    const ondelete = async () => {
        await mutateAsync({
            code: code as string || ""
        })
    }

    return (
        <div className=" w-full py-5">
            <div className=" flex flex-row items-center justify-between">
                <p className=" text-xl font-semibold">Course</p>
                <div>
                    {
                        state?.isEdit ?
                            <div className=" flex flex-row gap-1">
                                <Button
                                    type="button"
                                    variant={"outline"}
                                    size={"sm"}
                                    onClick={() => oncancel()}
                                    className=" flex flex-row items-center">
                                    Cancel
                                </Button>
                                <Button
                                    size={"sm"}
                                    className=" flex flex-row items-center px-5">
                                    Save
                                </Button>
                            </div>
                            :
                            <div className=" flex flex-row gap-1">
                                <Button
                                    type="button"
                                    variant={"ghost"}
                                    size={"sm"}
                                    onClick={() => state?.setIsEdit(true)}
                                    className=" flex flex-row gap-2 items-center">
                                    <Edit size={15} />
                                    <span className=" hidden md:flex">Edit</span>
                                </Button>
                                {
                                    selectedCourse && !selectedCourse._count.Curriculum && !selectedCourse._count.Student && <Button
                                        size={"sm"}
                                        disabled={isPending}
                                        variant={"destructive"}
                                        onClick={ondelete}
                                        type="button"
                                        className=" flex flex-row gap-2 items-center">
                                        <Trash size={15} />
                                        <span className=" hidden md:flex">Delete</span></Button>}
                            </div>
                    }

                </div>
            </div>
            <Separator className=" mb-3 mt-2" />
            <UpdateCourseForm isEdit={!!state?.isEdit} />
            <div className=" flex flex-row items-center justify-between mt-10">
                <p className=" text-xl font-semibold">Details</p>
            </div>
            <Separator className=" mb-3 mt-2" />
            <div className=" flex w-full flex-row gap-5">
                <div className=" border rounded flex flex-col items-center justify-center flex-1 p-5">
                    <p className="  text-4xl">{selectedCourse?._count.Student || 0}</p>
                    <p>Total Students</p>
                </div>
                <div className=" border rounded flex flex-col items-center justify-center flex-1 p-5">
                    <p className="  text-4xl">{selectedCourse?._count.Curriculum || 0}</p>
                    <p>Total Curriculum</p>
                </div>
            </div>
            <div className=" flex w-full items-center justify-center">
                {
                    selectedCourse && !selectedCourse._count.Curriculum && !selectedCourse._count.Student &&
                    <div className=" w-full md:w-[600px] flex items-center justify-center mt-5 flex-col">
                        <p className=" text-xs mt-1 text-orange-500 w-full">Note : Delete button only appears when there are no students or curriculums.</p>
                    </div>
                }
            </div>
        </div>
    )
}

export default Page;