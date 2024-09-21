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
import { Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { schoolYear, studentYear, yearNow } from "@/lib/helpers/selections";
import CurriculumLayout from "./_components/_layout";

const FormSchema = z.object({
    courseCode: z
        .string({
            required_error: "Please select an course.",
        }),
    schoolYear: z
        .string({
            required_error: "Please select school year.",
        }),
    studentYear: z.coerce.number()
})

const Page = () => {
    const { user } = useStore()
    const router = useRouter()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            studentYear: 0,
            schoolYear: `${yearNow}-${yearNow + 1}`,
        }
    })

    const { data: selectableCourses, isLoading: selectableCoursesIsLoading } = api.admin.global.getSelectableCourse.useQuery({
        departmenCode: user?.department || "",
    }, {
        enabled: !!user?.department
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        const { courseCode, schoolYear, studentYear } = data
        router.push(`curriculums/${courseCode}/${schoolYear}/${studentYear}/0`)
    }

    function onAdd() {
        router.push('curriculums/create')
    }

    return (
        <CurriculumLayout>
            <div className="flex flex-col h-full bg-background rounded overflow-hidden gap-2 border shadow-md w-full">
                <div className=" bg-muted p-3 px-5  h-12">
                    <p className="font-semibold">Curriculums of {user?.department?.toUpperCase()}</p>
                </div>
                <div className=" h-full w-full flex items-center pt-2 sm:pt-12 flex-col">
                    <div>
                        <div>
                            <p className=" text-3xl lg:text-5xl text-muted-foreground font-semibold">Search Curriculum</p>
                            <p className=" text-muted-foreground text-xl">{user?.department?.toUpperCase()} Department</p>
                        </div>
                        <div className=" w-full mt-10">

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="courseCode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Select Course</FormLabel>
                                                <Select disabled={selectableCoursesIsLoading} onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={selectableCoursesIsLoading ? "Loading ...": "Select a course"} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            selectableCourses?.map((course) => <SelectItem key={course.value} value={course.value}><span className="text-start text-nowrap">{course.label}</span></SelectItem>)
                                                        }
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    Select a course to search within this department.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className=" grid grid-cols-2 gap-5">

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
                                                                schoolYear().map((sy) => {
                                                                    return <SelectItem value={sy.value} key={sy.value}>{sy.label}</SelectItem>
                                                                })
                                                            }
                                                        </SelectContent>
                                                    </Select>
                                                    <FormDescription>
                                                        School year to search.
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
                                                                [{
                                                                    label: "All",
                                                                    value: 0
                                                                }, ...studentYear].map((sy) => {
                                                                    return <SelectItem key={sy.value} value={sy.value.toString()}>{sy.label}</SelectItem>
                                                                })
                                                            }
                                                        </SelectContent>
                                                    </Select>
                                                    <FormDescription>
                                                        Student year level to search.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className=" flex justify-end gap-5">
                                        <Button onClick={onAdd} type="button" size={"lg"} variant={"outline"} className=" px-10 w-full mt-5 flex flex-row  items-center gap-1">
                                            <Plus strokeWidth={2.5} size={20} /> <span className=" text-base">Create</span>
                                        </Button>
                                        <Button type="submit" size={"lg"} variant={"default"} className=" px-10 w-full mt-5 flex flex-row  items-center gap-1">
                                            <Search strokeWidth={2.5} size={20} /> <span className=" text-base">Search</span>
                                        </Button>
                                    </div>
                                </form>
                            </Form>

                        </div>
                    </div>
                </div>
            </div>
        </CurriculumLayout>);
}

export default Page;