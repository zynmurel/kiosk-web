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
        code: code as string,
        departmenCode: user?.department || "",
    }, {
        enabled: !!code && !!user?.department
    })

    const { refetch: refetchCourses } = api.admin.course.getCourseByDepartment.useQuery({
        departmenCode: user?.department || ""
    }, {
        enabled: !!user?.department
    })

    const { mutateAsync, isPending } = api.admin.course.deleteCourse.useMutation({
        onSuccess: async () => {
            toast({
                title: "Success!",
                description: "Course deleted."
            })
            if (!code) form.reset()
            router.push("/admin/courses")
            await refetchCourses()
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
        <div className=" w-full">
            <div className=" flex flex-row items-center justify-between bg-muted p-1 px-5 h-12">
                <p className="font-semibold">Course</p>
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
                                    variant={"outline"}
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
            <div className=" px-5 xl:px-10">

            <UpdateCourseForm isEdit={!!state?.isEdit} />
            <Separator className="my-5" />
            <div className=" flex w-full flex-row gap-5">
                <Button variant={"outline"} type="button" className=" flex-1 ">
                    Students : {selectedCourse?._count.Student}
                </Button>
                <Button variant={"outline"} type="button" className=" flex-1 ">
                    Curriculums : {selectedCourse?._count.Curriculum}
                </Button>
            </div>
            <p className=" text-xs mt-5 text-orange-500 ">Note : Delete course button will appear when there are no students and no curriculums.</p>
            </div>

        </div>
    )
}

export default Page;