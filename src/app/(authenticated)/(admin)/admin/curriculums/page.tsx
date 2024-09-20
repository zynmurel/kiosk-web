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
import { toast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";

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
        .string({
            required_error: "Please select student year.",
        })
})
const Page = () => {
    const { user } = useStore()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    const { data: selectableCourses, isLoading: selectableCoursesIsLoading } = api.admin.global.getSelectableCourse.useQuery({
      departmenCode: user?.department || "",
    }, {
      enabled: !!user?.department
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
    }
    return (
        <div className="flex flex-col h-full bg-background rounded overflow-hidden gap-2 border shadow-md w-full">
            <div className=" bg-muted p-3 px-5  h-12">
                <p className="font-semibold">Curriculums of {user?.department?.toUpperCase()}</p>
            </div>
            <div className=" h-full w-full flex items-center p-12 flex-col">
                <div>
                    <div>
                        <p className=" text-3xl lg:text-5xl text-muted-foreground font-semibold">Search Curriculum</p>
                        <p className=" text-muted-foreground text-xl">{user?.department?.toUpperCase()} Department</p>
                    </div>
                    <div className=" w-full mt-5">

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
                                                        <SelectValue placeholder="Select a course" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {
                                                        selectableCourses?.map((course)=><SelectItem key={course.value} value={course.value}><span className="text-start text-nowrap">{course.label}</span></SelectItem>)
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
                                <FormField
                                    control={form.control}
                                    name="schoolYear"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Select School Year</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a school year" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="m@example.com">m@example.com</SelectItem>
                                                    <SelectItem value="m@google.com">m@google.com</SelectItem>
                                                    <SelectItem value="m@support.com">m@support.com</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Select a school year to search.
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
                                            <FormLabel>Select Student Yr Level</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a student year level" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="m@example.com">m@example.com</SelectItem>
                                                    <SelectItem value="m@google.com">m@google.com</SelectItem>
                                                    <SelectItem value="m@support.com">m@support.com</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                            Select a student year level to search.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">Submit</Button>
                            </form>
                        </Form>

                    </div>
                </div>
            </div>
        </div>);
}

export default Page;