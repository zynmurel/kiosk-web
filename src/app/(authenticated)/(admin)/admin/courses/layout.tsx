'use client'
import CourseTable from "./_components/table";
import { useStore } from "@/lib/store/app";
import CourseLayout from "./_components/_layout"
import { useParams, useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { toast } from "@/hooks/use-toast";
import Loading from "./_components/loading";
import { useEffect, useState } from "react";
import { CourseContext } from "@/lib/context/course";

export const FormSchema = z.object({
    code: z.string().min(3,{
        message: "Course code must be at least 3 characters.",
    }),
    title: z.string().min(3,{
        message: "Course title is required.",
    }),
})
const Layout = ({ children }: { children: React.ReactNode }) => {
    const [isEdit, setIsEdit] = useState(false)
    const router = useRouter()
    const { user } = useStore()
    const { code } = useParams()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema)
    })

    const { data: courses, isLoading: coursesIsLoading, refetch:refetchCourses } = api.admin.course.getCourseByDepartment.useQuery({
        departmenCode: user?.department || ""
    }, {
        enabled: !!user?.department
    })

    const { data: selectedCourse, isLoading: selectedCourseIsLoading, refetch:refetchSelectedCourse } = api.admin.course.getCourse.useQuery({
        code: code as string,
        departmenCode: user?.department || "",
    }, {
        enabled: !!code && !!user?.department
    })
    useEffect(()=>{
        setIsEdit(false)
    },[code])
    const { mutateAsync, isPending } = api.admin.course.upsertCourse.useMutation({
        onSuccess:async (data) => {
            toast({
              title: "Success!",
              description: !code ? "New Course added successfully!" : "Course updated successfully!"
            })
            setIsEdit(false)
            if(!code) form.reset()
            router.push("/admin/courses/"+data.code)
            await Promise.all([refetchCourses(),refetchSelectedCourse()])
          },
          onError: (e) => {
            if(e.message.includes("Unique constraint failed on the fields")){
                toast({
                  variant: "destructive",
                  title: "Creating course failed",
                  description: "Course code already exist."
                })
                form.setError("code", { message:"Course code already exist." })
            } else {
                toast({
                  variant: "destructive",
                  title: "Creating course failed",
                  description: e.message
                })
            }
          }
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try{
            if(user?.department){
                await mutateAsync({
                    id: code as string|undefined,
                    departmenCode : user.department,
                    ...data
                })
            }
        } catch(e){
            console.log(e)
        }
    }

    useEffect(()=>{
        if(selectedCourse){
            form.clearErrors()
            form.setValue("code", selectedCourse.code)
            form.setValue("title", selectedCourse.title)
        } else if(!code){
            form.reset({
                code:"",
                title:""
            })
        }
    },[code, form, selectedCourse])
    return (

        <CourseContext.Provider value={{ isEdit, setIsEdit }}>
        <CourseLayout>
            <div className=" w-full space-y-5 flex flex-col">
                <div className=" grid lg:grid-cols-2 xl:grid-cols-5 lg:h-full gap-5">
                    <CourseTable courses={courses || []} coursesIsLoading={coursesIsLoading} />
                    <div className=" border rounded xl:col-span-2 flex justify-center w-full h-full relative bg-background">
                        {(isPending || selectedCourseIsLoading) && 
                        <div className=" absolute bg-background opacity-50 z-10 top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                            <Loading/>
                        </div>}
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                                {children}
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </CourseLayout>
        </CourseContext.Provider>
    );
}

export default Layout;