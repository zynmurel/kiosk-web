'use client'
import { useStore } from "@/lib/store/app";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
import { api } from "@/trpc/react";
import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { schoolYear, semesters, studentYear, yearNow } from "@/lib/helpers/selections";
import { format } from "date-fns";
import { useState } from "react";
import { AddSubjectDialog } from "./_components/add-subject-dialog";
import { toast } from "@/hooks/use-toast";
import { ConfirmDialog } from "./_components/confirm-dialog";
import Loading from "../_components/loading";
import SubjectContents from "./_components/subjects-content";

const FormSchema = z.object({
    courseCode: z
        .string({
            required_error: "Please select an course.",
        }),
    schoolYear: z
        .string({
            required_error: "Please select school year.",
        }),
    studentYear: z.coerce.number(),
    semester: z.coerce.number()
})

export type SubjectsSelectedType = {
    subjectId: number;
    instructorId: number;
}

export type SectionAddedType = {
    sectionName: string;
}

const Page = () => {
    const { user } = useStore()
    const router = useRouter()
    const [subjectsSelected, setSubjectsSelected] = useState<SubjectsSelectedType[]>()
    const [isAddSubject, setIsAddSubject] = useState(false)
    const [openConfirm, setOpenConfirm] = useState<z.infer<typeof FormSchema> & { subjects: SubjectsSelectedType[] } | undefined>(undefined)
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            studentYear: 1,
            semester: 1,
            schoolYear: `${yearNow}-${yearNow + 1}`,
        }
    })
    
    api.admin.global.getSelectableInstructors.useQuery({
        departmentCode: user?.department || "",
    }, {
        enabled: !!user?.department
    })

    api.admin.global.getSelectableSubjects.useQuery({
        departmentCode: user?.department || "",
    }, {
        enabled: !!user?.department
    })

    const { data: selectableCourses, isLoading: selectableCoursesIsLoading } = api.admin.global.getSelectableCourse.useQuery({
        departmenCode: user?.department || "",
    }, {
        enabled: !!user?.department
    })

    const { mutateAsync: createCurriculum, isPending: createCurriculumIsPending } = api.admin.curriculum.createCurriculum.useMutation({
        onSuccess: async (data) => {
            toast({
                title: "Success!",
                description: "Curriculum Created."
            })
            setSubjectsSelected(undefined)
            setOpenConfirm(undefined)
            form.reset()
            const { courseCode, school_year, student_year, semester } = data
            router.push(`${courseCode}/${school_year}/${student_year}/${semester}`)
        },
        onError: (e) => {
            setOpenConfirm(undefined)
            if (e.message.includes("Unique constraint failed on the fields")) {
                toast({
                    variant: "destructive",
                    title: "Failed",
                    description: "Curriculum with this details already exist"
                })
                form.setError("courseCode", { message: "" })
                form.setError("schoolYear", { message: "" })
                form.setError("studentYear", { message: "" })
                form.setError("semester", { message: "" })
            } else {
                toast({
                    variant: "destructive",
                    title: "Failed",
                    description: e.message
                })
            }
        }
    })

    const onRemoveSubject = (id: number) => {
        setSubjectsSelected(prev => prev?.filter((sub) => sub.subjectId !== id))
    }

    function onSubmit(data: z.infer<typeof FormSchema>) {
        if (!subjectsSelected?.length) {
            toast({
                variant: "destructive",
                title: "No Subject",
                description: "Add subjects to your curriculum.",
            })
        } else {
            setOpenConfirm({
                ...data,
                subjects: subjectsSelected
            })
        }
    }

    const onOpenChangeConfirm = (e: boolean) => {
        if (!e) {
            setOpenConfirm(undefined)
        }
    }

    const onConfirmSubmittion = async (data: z.infer<typeof FormSchema> & { subjects: SubjectsSelectedType[] }) => {
        if (!!user?.department) {
            try {

                await createCurriculum({ ...data, departmenCode: user.department })
            } catch (e) {
                console.log(e)
            }
        } else {
            toast({
                variant: "destructive",
                title: "No Department Found",
            })
        }
    }

    return (
        <div className="flex flex-col h-full bg-background rounded overflow-hidden gap-2 border shadow-md w-full">
            <div className=" bg-muted p-3 px-5  h-12">
                <p className="font-semibold">Create new Curriculum</p>
            </div>
            <div className=" flex flex-col gap-5 xl:px-10 p-5 relative">
                {(createCurriculumIsPending) &&
                    <div className=" absolute bg-background opacity-50 z-10 top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                        <Loading />
                    </div>}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className=" flex flex-col xl:flex-row gap-5">
                            <FormField
                                control={form.control}
                                name="courseCode"
                                render={({ field }) => (
                                    <FormItem className=" flex-1">
                                        <FormLabel>Select Course</FormLabel>
                                        <Select disabled={selectableCoursesIsLoading} onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={selectableCoursesIsLoading ? "Loading ..." : "Select a course"} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    selectableCourses?.map((course) => <SelectItem key={course.value} value={course.value}><span className="text-start text-nowrap">{course.label}</span></SelectItem>)
                                                }
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            Select a course for the curriculum.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className=" grid grid-cols-2 md:grid-cols-3 gap-5 flex-1">

                                <FormField
                                    control={form.control}
                                    name="schoolYear"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>School Year</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a school year" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {
                                                        schoolYear(Number(format(new Date(), "yyyy"))).map((sy) => {
                                                            return <SelectItem value={sy.value} key={sy.value}>{sy.label}</SelectItem>
                                                        })
                                                    }
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Select school year.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="studentYear"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Student Yr Level</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a student year level" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {
                                                        studentYear.map((sy) => {
                                                            return <SelectItem key={sy.value} value={sy.value.toString()}>{sy.label}</SelectItem>
                                                        })
                                                    }
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Select year level.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="semester"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Semester</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a semester" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {
                                                        semesters.map((sy) => {
                                                            return <SelectItem key={sy.value} value={sy.value.toString()}>{sy.label}</SelectItem>
                                                        })
                                                    }
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Select semester
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <SubjectContents
                            subjectsSelected={subjectsSelected}
                            onRemoveSubject={onRemoveSubject}
                            setIsAddSubject={setIsAddSubject}
                        />

                        <div className=" flex justify-end gap-2">
                            <Button onClick={() => router.back()} type="button" variant={"outline"} className=" flex flex-row  items-center gap-1">
                                Back
                            </Button>
                            <Button type="submit" variant={"default"} className=" flex flex-row  items-center gap-1">
                                <ArrowUpRight size={18} /><span>Submit</span>
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
            <AddSubjectDialog open={isAddSubject} setOpen={setIsAddSubject} setSubjectsSelected={setSubjectsSelected} subjectsSelected={subjectsSelected} />
            <ConfirmDialog open={openConfirm} setOpen={onOpenChangeConfirm} onConfirm={onConfirmSubmittion} createCurriculumIsPending={createCurriculumIsPending} />
        </div>);
}

export default Page;