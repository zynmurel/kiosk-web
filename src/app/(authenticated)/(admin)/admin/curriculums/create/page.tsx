'use client'
import { useStore } from "@/lib/store/app";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
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
import { ArrowUpRight, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { schoolYear, semesters, studentYear, yearNow } from "@/lib/helpers/selections";
import { format } from "date-fns";
import { useState } from "react";
import { AddSubjectDialog } from "./_components/add-subject-dialog";

const FormSchema = z.object({
    courseCode: z
        .string({
            required_error: "Please select an course.",
        }),
    schoolYear: z
        .string({
            required_error: "Please select school year.",
        }),
    studentYear: z
        .enum(["FIRST", "SECOND", "THIRD", "FOURTH", "FIFTH"], {
            required_error: "Please select student year level.",
        }),
    semester: z
        .enum(["FIRST", "SECOND"], {
            required_error: "Please select semester.",
        }),
})

export type SubjectsSelectedType = {
    subjectId : number;
    instructorId : number;
}

const Page = () => {
    const { user } = useStore()
    const router = useRouter()
    const [subjectsSelected, setSubjectsSelected] = useState<SubjectsSelectedType[]>()
    const [isAddSubject, setIsAddSubject] = useState(false)
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            studentYear: "FIRST",
            semester: "FIRST",
            schoolYear: `${yearNow}-${yearNow + 1}`,
        }
    })

    const { data: selectableCourses, isLoading: selectableCoursesIsLoading } = api.admin.global.getSelectableCourse.useQuery({
        departmenCode: user?.department || "",
    }, {
        enabled: !!user?.department
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

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data)
    }

    return (
        <div className="flex flex-col h-full bg-background rounded overflow-hidden gap-2 border shadow-md w-full">
            <AddSubjectDialog open={isAddSubject} setOpen={setIsAddSubject} setSubjectsSelected={setSubjectsSelected} subjectsSelected={subjectsSelected}/>
            <div className=" bg-muted p-3 px-5  h-12">
                <p className="font-semibold">Create new Curriculum</p>
            </div>
            <div className=" flex flex-col gap-5 xl:px-10 p-5">
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
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a student year level" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {
                                                        studentYear.map((sy) => {
                                                            return <SelectItem key={sy.value} value={sy.value}>{sy.label}</SelectItem>
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
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a semester" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {
                                                        semesters.map((sy) => {
                                                            return <SelectItem key={sy.value} value={sy.value}>{sy.label}</SelectItem>
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
                        <div>
                        <p className="pb-1">Subjects on this Curriculum</p>
                        <div className=" p-2 border rounded-lg bg-muted flex flex-col space-y-2">
                            {
                                !subjectsSelected?.length ? 
                                <div className=" bg-muted text-muted-foreground flex items-center justify-center flex-col w-full p-5 border border-muted-foreground opacity-60 rounded border-dashed">
                                    <Plus size={36} />
                                    <p className="">Add subjects to your new curriculum</p>
                                </div>:
                                <div></div>
                            }
                            <Button onClick={()=>setIsAddSubject(true)} type="button" variant={"outline"} className="flex self-end flex-row px-5 items-center gap-1">
                                <Plus strokeWidth={2.5} size={16} /> <span>Add Subject</span>
                            </Button>
                        </div>
                        </div>
                        <div className=" flex justify-end gap-2">
                            <Button onClick={()=>router.back()} type="button" variant={"outline"} className=" flex flex-row  items-center gap-1">
                                Cancel
                            </Button>
                            <Button type="submit" variant={"default"} className=" flex flex-row  items-center gap-1">
                            <ArrowUpRight size={18} /><span>Submit</span>
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>);
}

export default Page;