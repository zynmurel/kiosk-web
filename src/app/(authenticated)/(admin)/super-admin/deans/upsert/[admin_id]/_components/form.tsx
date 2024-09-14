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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useParams, useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { api } from "@/trpc/react"
import { useEffect } from "react"
import Loading from "./loading"
import { PlusCircle } from "lucide-react"

const FormSchema = z.object({
    fullName: z.string({
        message: "Deans full name is required.",
    }),
    departmentCode: z.string({
        message: "Deans department is required.",
    }),
    contact: z.string().optional(),
    email: z.string().optional(),
    employeeID: z.string({
        message: "Deans employee ID is required.",
    }),
})
const UpsertDeanForm = () => {
    const { admin_id } = useParams()
    const { toast } = useToast()
    const router = useRouter()

    const isCreate = Number.isNaN(Number(admin_id))

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    const { refetch:refetchAllDeans } = api.admin.getAllDeans.useQuery()

    const { data:selectableDepartments, isLoading:selectableDepartmentsIsLoading } = api.admin.getSelectableDepartment.useQuery({
        id: Number.isNaN(Number(admin_id)) ? undefined : Number(admin_id)
    })

    const { data: dean, isLoading: deanIsLoading } = api.admin.getDean.useQuery({
        id: Number(admin_id)
    }, {
        enabled: !isCreate
    })
    

    const { mutateAsync, isPending } = api.admin.upsertDean.useMutation({
        onSuccess:async () => {
            toast({
              title: "Success!",
              description: isCreate ? "New Dean added successfully!" : "Dean updated successfully!"
            })
            await refetchAllDeans()
            form.reset()
            router.push("/super-admin/deans")
          },
          onError: (e) => {
            if(e.message.includes("Unique constraint failed on the fields")){
                toast({
                  variant: "destructive",
                  title: "Creating dean failed",
                  description: "Employee ID already exist."
                })
                form.setError("employeeID", { message:"Employee ID already exist." })
            } else {
                toast({
                  variant: "destructive",
                  title: "Creating dean failed",
                  description: e.message
                })
            }
          }
    })

    const onCancel = () => router.back()

    const onAddDepartment = () => router.push("/super-admin/departments/upsert/new")

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try{
            await mutateAsync({
                id : isCreate ? undefined : Number(admin_id),
                ...data
            })
            console.log(data)
        } catch(e){
            console.log(e)
        }
    }

    useEffect(()=>{
        if(dean && selectableDepartments){
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            form.setValue("fullName", dean.fullName)
            form.setValue("departmentCode", dean.departmentCode)
            form.setValue("contact", dean.contact || undefined)
            form.setValue("email", dean.email || undefined)
            form.setValue("employeeID", dean.employeeID)
        }
    },[dean, selectableDepartments, form, isCreate])
    return (
        <div className=" border rounded-lg w-full mt-5 p-5 px-10 shadow-md bg-background relative overflow-hidden">
            {(deanIsLoading || selectableDepartmentsIsLoading) &&
            <div className=" absolute bg-background bg-opacity-50 z-10 top-0 left-0 right-0 bottom-0 flex items-center justify-center" style={{ opacity:.5}}>
                <Loading/>
            </div>}
            <div className=" text-lg font-semibold pt-2">
                {"Dean's Details"}
            </div>
            <Separator className=" mb-3 mt-2"/>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                    control={form.control}
                    name="departmentCode"
                    render={({ field }) => (
                        <FormItem defaultValue={field.value}>
                        <FormLabel>Select a Department</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a Department" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {
                                    selectableDepartments?.map((department)=><SelectItem className="py-4" key={department.value} value={department.value}>{department.label}</SelectItem>)
                                }
                                { !selectableDepartments?.length && !selectableDepartmentsIsLoading && <div className=" text-sm w-full text-center py-3 border rounded my-1 text-muted-foreground bg-muted">No available department to assign.</div>}
                                <Button variant={"outline"} size={"sm"} onClick={onAddDepartment} className=" w-full flex flex-row items-center gap-1 mt-2"><PlusCircle size={20} />Add Department</Button>
                            </SelectContent>
                        </Select>
                        <FormDescription>
                        List of departments available to assign to the dean.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                        control={form.control}
                        name="employeeID"
                        render={({ field }) => (
                            <FormItem className=" relative">
                                <FormLabel>Employee ID</FormLabel>
                                <FormControl>
                                    <Input placeholder="Input dean's employee ID" {...field} className=" w-[200px]" />
                                </FormControl>
                                <FormDescription>
                                    {"This is for the dean's employee ID."}
                                </FormDescription>
                                <FormMessage className=" absolute -bottom-5" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem className=" relative">
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Input dean's name" {...field} />
                                </FormControl>
                                <FormDescription>
                                    {"This is for the dean's full name."}
                                </FormDescription>
                                <FormMessage className=" absolute -bottom-5" />
                            </FormItem>
                        )}
                    />
                    <div className="grid sm:grid-cols-2 gap-2 pb-2">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className=" relative">
                                <FormLabel>Email (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Input dean's email" {...field} />
                                </FormControl>
                                <FormDescription>
                                    {"This is for the dean's email."}
                                </FormDescription>
                                <FormMessage className=" absolute -bottom-5" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="contact"
                        render={({ field }) => (
                            <FormItem className=" relative">
                                <FormLabel>Contact (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Input dean's contact number" {...field} />
                                </FormControl>
                                <FormDescription>
                                    {"This is for the dean's contact number."}
                                </FormDescription>
                                <FormMessage className=" absolute -bottom-5" />
                            </FormItem>
                        )}
                    />
                    </div>
                    <div className=" pb-5  w-full flex justify-end gap-2">
                        <Button onClick={onCancel} variant={"secondary"} type="button" className=" w-28 border">Cancel</Button>
                        <Button type="submit" disabled={isPending || deanIsLoading} className=" w-28">{isCreate ? "Create" : "Update"} </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default UpsertDeanForm;