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
import { Textarea } from "@/components/ui/textarea"

const FormSchema = z.object({
    title: z.string({
        message: "Company name is required.",
    }),
    description: z.string({
        message: "Description is required.",
    }),
    contact: z.string().optional(),
    email: z.string().optional(),
    username: z.string({
        message: "Username is required.",
    })
})
const UpsertDeanForm = () => {
    const { admin_id } = useParams()
    const { toast } = useToast()
    const router = useRouter()

    const isCreate = Number.isNaN(Number(admin_id))


    const { refetch:refetchAllCompanies } = api.super.company.getAllCompanies.useQuery()

    const { data: company, isLoading: companyIsLoading } = api.super.company.getCompany.useQuery({
        id: Number(admin_id)
    }, {
        enabled: !isCreate
    })
    
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        values :company ? {
            title : company.title,
            description : company.description,
            contact : company.contact || undefined,
            email : company.email || undefined,
            username : company.username,
        } :  undefined
    })

    const { mutateAsync, isPending } = api.super.company.upsertCompany.useMutation({
        onSuccess:async () => {
            toast({
              title: "Success!",
              description: isCreate ? "New Dean added successfully!" : "Dean updated successfully!"
            })
            await refetchAllCompanies()
            form.reset()
            router.push("/super-admin/company")
          },
          onError: (e) => {
            if(e.message.includes("Unique constraint failed on the fields")){
                toast({
                  variant: "destructive",
                  title: "Creating company failed",
                  description: "Username already exist."
                })
                form.setError("username", { message:"Username already exist." })
            } else {
                toast({
                  variant: "destructive",
                  title: "Creating company failed",
                  description: e.message
                })
            }
          }
    })

    const onCancel = () => router.back()

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
        if(company){
            form.setValue("title", company.title)
            form.setValue("description", company.description)
            form.setValue("contact", company.contact || undefined)
            form.setValue("email", company.email || undefined)
            form.setValue("username", company.username)
        }
    },[company, form, isCreate])
    return (
        <div className=" border rounded-lg w-full mt-5 p-5 px-10 shadow-md bg-background relative overflow-hidden">
            {(companyIsLoading) &&
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
                        name="username"
                        render={({ field }) => (
                            <FormItem className=" relative">
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Input company username" {...field} className=" w-[200px]" />
                                </FormControl>
                                <FormDescription>
                                    {"This is for company username"}
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
                                <FormLabel>Company Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Input company name" {...field} />
                                </FormControl>
                                <FormDescription>
                                    {"This is for the company name."}
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
                                    <Textarea placeholder="Input description" {...field} className=" w-full" />
                                </FormControl>
                                <FormDescription>
                                    {"This is for the description."}
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
                                    <Input placeholder="Input company email" {...field} />
                                </FormControl>
                                <FormDescription>
                                    {"This is for the company email."}
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
                                    <Input placeholder="Input company contact number" {...field} />
                                </FormControl>
                                <FormDescription>
                                    {"This is for the company contact number."}
                                </FormDescription>
                                <FormMessage className=" absolute -bottom-5" />
                            </FormItem>
                        )}
                    />
                    </div>
                    <div className=" pb-5  w-full flex justify-end gap-2">
                        <Button onClick={onCancel} variant={"secondary"} type="button" className=" w-28 border">Cancel</Button>
                        <Button type="submit" disabled={isPending} className=" w-28">{isCreate ? "Create" : "Update"} </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default UpsertDeanForm;