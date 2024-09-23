'use client'
import SubjectTable from "./_components/table";
import { useStore } from "@/lib/store/app";
import SubjectLayout from "./_components/_layout"
import { useParams, useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { toast } from "@/hooks/use-toast";
import Loading from "./_components/loading";
import { useEffect, useState } from "react";
import { SubjectContext } from "@/lib/context/subject";
import { type SubjectType } from "@/lib/types/admin/subject";
import { Button } from "@/components/ui/button";

export const FormSchema = z.object({
    code: z.string().min(3,{
        message: "Subject code must be at least 3 characters.",
    }),
    title: z.string().min(3,{
        message: "Subject title is required.",
    }),
    description: z.string().min(3,{
        message: "Subject description is required.",
    }),
    units: z.coerce.number({
        message: "Subject units is required.",
    }).min(1,{
        message: "Subject units is required.", 
    }),
    type: z.enum(["MINOR", "MAJOR"], { message : "Subject type required."})
})
const Layout = ({ children }: { children: React.ReactNode }) => {
    const [isEdit, setIsEdit] = useState(false)
    const [subjectType, setSubjectType] = useState<SubjectType>("ALL")
    const [searchText, setSearchText] = useState("")
    const router = useRouter()
    const { user } = useStore()
    const { id } = useParams()

    const { data: subjects, isLoading: subjectsIsLoading, refetch:refetchsubjects } = api.admin.subject.getSubjectsByType.useQuery({
        departmenCode: user?.department || "",
        type :subjectType
    }, {
        enabled: !!user?.department
    })

    const { data: selectedSubject, isLoading: selectedSubjectIsLoading, refetch:refetchSelectedSubject } = api.admin.subject.getSubject.useQuery({
        id: Number(id),
        departmenId: user?.department || "",
    }, {
        enabled: !Number.isNaN(Number(id)) && !!user?.department
    })

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        values :selectedSubject ? {
            code : selectedSubject.code,
            title : selectedSubject.title,
            type : selectedSubject.type,
            description : selectedSubject.description,
            units : selectedSubject.units,
        } :  undefined
    })
    const { mutateAsync, isPending } = api.admin.subject.upsertSubject.useMutation({
        onSuccess:async (data) => {
            toast({
              title: "Success!",
              description: !id ? "New Subject added successfully!" : "Subject updated successfully!"
            })
            await Promise.all([
                refetchsubjects(),
                data.id === Number(id) && refetchSelectedSubject()
            ])
            setIsEdit(false)
            if(!id) form.reset()
            router.push("/admin/subjects/"+data.id)
          },
          onError: (e) => {
            if(e.message.includes("Unique constraint failed on the fields")){
                toast({
                  variant: "destructive",
                  title: "Creating subject failed",
                  description: "Subject code already exist."
                })
                form.setError("code", { message:"Subject code already exist." })
            } else {
                toast({
                  variant: "destructive",
                  title: "Creating subject failed",
                  description: e.message
                })
            }
          }
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try{
            if(user?.department){
                await mutateAsync({
                    id: Number(id) || 0,
                    departmenId : user.department,
                    ...data
                })
            }
        } catch(e){
            console.log(e)
        }
    }

    useEffect(()=>{
        if(selectedSubject){
            form.clearErrors()
            form.setValue("code", selectedSubject.code)
            form.setValue("title", selectedSubject.title)
            form.setValue("type", selectedSubject.type)
            form.setValue("description", selectedSubject.description)
            form.setValue("units", selectedSubject.units)
        } else if(!id){
            form.reset({
                code:"",
                title:"",
                description:"",
                units:0,
                type : "MINOR",
            })
        }
    },[id, form, selectedSubject])

    useEffect(()=>{
        setIsEdit(false)
    },[id])
    return (

        <SubjectContext.Provider value={{ isEdit, setIsEdit, subjectType, setSubjectType, searchText, setSearchText }}>
        <SubjectLayout>
            <div className=" w-full space-y-5 flex flex-col">
                <div className=" grid lg:grid-cols-2 xl:grid-cols-5 lg:h-full gap-5">
                    <SubjectTable subjects={subjects?.filter(sub=>sub.code.includes(searchText)) ||[]} subjectsIsLoading={subjectsIsLoading} />
                    <div className=" border rounded xl:col-span-2 flex justify-center w-full h-full relative bg-background shadow-md">
                        {(isPending || selectedSubjectIsLoading) && 
                        <div className=" absolute bg-background opacity-50 z-10 top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                            <Loading/>
                        </div>}
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                                {children}
                            {!id && <div className="w-full flex justify-end gap-2  xl:px-10 p-5">
                                <Button type="submit" className=" w-28">{"Create"} </Button>
                            </div>}
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </SubjectLayout>
        </SubjectContext.Provider>
    );
}

export default Layout;