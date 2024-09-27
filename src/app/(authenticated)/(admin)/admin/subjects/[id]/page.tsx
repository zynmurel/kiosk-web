'use client'

import { useParams, useRouter } from "next/navigation";
import UpsertSubjectForm from "../_components/upsert-form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { api } from "@/trpc/react";
import { useSubjectContext } from "@/lib/context/subject";
import { toast } from "@/hooks/use-toast";
import { useStore } from "@/lib/store/app";

const Page = () => {
    const { user } = useStore()
    const state = useSubjectContext()
    const form = useFormContext()
    const router = useRouter()
    const { id } = useParams()

    const { data: selectedSubject  } = api.admin.subject.getSubject.useQuery({
        id: Number(id),
        departmenId: user?.department || "",
    }, {
        enabled: !Number.isNaN(Number(id)) && !!user?.department
    })

    const { refetch: refetchSubjects } = api.admin.subject.getSubjectsByType.useQuery({
        departmenCode: user?.department || "",
        type :state?.subjectType || "ALL"
    }, {
        enabled: false
    })

    const { mutateAsync, isPending } = api.admin.subject.deleteSubject.useMutation({
        onSuccess: async () => {
            toast({
                title: "Success!",
                description: "Subject deleted."
            })
            await refetchSubjects()
            if (!id) form.reset()
            router.push("/admin/subjects")
        },
        onError: (e) => {
            toast({
                variant: "destructive",
                title: "Deleting subject failed",
                description: e.message
            })
        }
    })

    const oncancel = () => {
        state?.setIsEdit(false)
        if (selectedSubject) {
            form.setValue("code", selectedSubject.code)
            form.setValue("title", selectedSubject.title)
            form.setValue("type", selectedSubject.type)
            form.setValue("description", selectedSubject.description)
            form.setValue("units", selectedSubject.units)
        }
    }

    const ondelete = async () => {
        await mutateAsync({
            id: Number(id)
        })
    }

    const onedit = () => {
        state?.setIsEdit(true)
        if (selectedSubject) {
            form.setValue("code", selectedSubject.code)
            form.setValue("title", selectedSubject.title)
            form.setValue("type", selectedSubject.type)
            form.setValue("description", selectedSubject.description)
            form.setValue("units", selectedSubject.units)
        }
    }

    return (
        <div className=" w-full">
            <div className=" flex flex-row items-center justify-between bg-muted p-1 px-5 h-12">
                <p className="font-semibold">Subject</p>
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
                                    onClick={() => onedit()}
                                    className=" flex flex-row gap-2 items-center">
                                    <Edit size={15} />
                                    <span className=" hidden md:flex">Edit</span>
                                </Button>
                                {
                                    selectedSubject && !selectedSubject._count.CurriculumSubjects && <Button
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

            <UpsertSubjectForm isEdit={!!state?.isEdit} />
            <Separator className="my-5" />
            <div className=" flex w-full flex-row gap-5">
                <Button variant={"outline"} type="button" className=" flex-1 ">
                    Curriculums : {selectedSubject?._count.CurriculumSubjects}
                </Button>
            </div>
            <p className=" text-xs mt-5 text-orange-500 ">Note : Delete subject button will appear when the subject is not assigned to any curriculums.</p>
            </div>

        </div>
    )
}

export default Page;