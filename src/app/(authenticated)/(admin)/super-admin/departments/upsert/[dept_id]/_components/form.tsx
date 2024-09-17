"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { useParams, useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { api } from "@/trpc/react"
import { useEffect } from "react"
import Loading from "../../../list/[id]/_components/loading"

const FormSchema = z.object({
    code: z.string({
        message: "Department code must be at least 3 characters.",
    }),
    title: z.string({
        message: "Department title is required.",
    }),
    description: z.string({
        message: "Department description is required.",
    })
})
const UpsertDepartmentForm = () => {
    const { dept_id } = useParams()
    const isCreate = Number.isNaN(Number(dept_id))
    const { toast } = useToast()
    const router = useRouter()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema)
    })
    // const { data:departments, isLoading:departmentsIsLoading } = api.department.getD.useQuery()
    const { refetch:refetchAllDepartments } = api.super.department.getAllDepartments.useQuery()
    const { refetch:refetchDepartment } = api.super.department.getDepartment.useQuery({
        id: Number(dept_id)
    }, {
        enabled: false
    })

    const { data: department, isLoading: departmentIsLoading } = api.super.department.getDepartment.useQuery({
        id: Number(dept_id)
    }, {
        enabled: !isCreate
    })
    

    const { mutateAsync, isPending } = api.super.department.upsertDepartment.useMutation({
        onSuccess:async () => {
            toast({
              title: "Success!",
              description: isCreate ? "New Department added successfully!" : "Department updated successfully!"
            })
            form.reset()
            router.push("/super-admin/departments")
            await refetchAllDepartments()
            await refetchDepartment()
          },
          onError: (e) => {
            if(e.message.includes("Unique constraint failed on the fields")){
                toast({
                  variant: "destructive",
                  title: "Creating department failed",
                  description: "Department code already exist."
                })
                form.setError("code", { message:"Department code already exist." })
            }
            toast({
              variant: "destructive",
              title: "Creating department failed",
              description: e.message
            })
          }
    })

    const onCancel = () => router.back()

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try{
            await mutateAsync({
                id : isCreate ? undefined : Number(dept_id),
                ...data
            })
        } catch(e){
            console.log(e)
        }
    }

    useEffect(()=>{
        if(department){
            form.setValue("code", department.code)
            form.setValue("title", department.title)
            form.setValue("description", department.description)
        }
    },[department, form])

    return (
        <div className=" border rounded-lg w-full mt-5 p-5 px-10 shadow-md bg-background relative overflow-hidden">
            {departmentIsLoading && 
            <div className=" absolute bg-background bg-opacity-50 z-10 top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                <Loading/>
            </div>}
            <div className=" text-lg font-semibold pt-2">
                Department Details
            </div>
            <Separator className=" mb-3 mt-2"/>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem className=" relative">
                                <FormLabel>Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="Input department code" className=" max-w-[200px]" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is for the code of the department.
                                </FormDescription>
                                <FormMessage className=" absolute -bottom-5" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className=" relative">
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Input department title" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is for the title of the department.
                                </FormDescription>
                                <FormMessage className=" absolute -bottom-5" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className=" relative">
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Input department description" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is for the description of the department.
                                </FormDescription>
                                <FormMessage className=" absolute -bottom-5" />
                            </FormItem>
                        )}
                    />
                    <div className=" pb-5  w-full flex justify-end gap-2">
                        <Button onClick={onCancel} variant={"secondary"} type="button" className=" w-28 border">Cancel</Button>
                        <Button type="submit" disabled={isPending || departmentIsLoading} className=" w-28">{isCreate ? "Create" : "Update"} </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default UpsertDepartmentForm;