'use client'
import { useFormContext } from "react-hook-form"
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { api } from "@/trpc/react"
import { useStore } from "@/lib/store/app"
import { useStudentContext } from "@/lib/context/student"
const UpsertSubjectForm = () => {
    const form = useFormContext()
    const state = useStudentContext()
    const {user} = useStore()
    const { data: selectableCourses, isLoading: selectableCoursesIsLoading } = api.admin.student.getSelectableCourse.useQuery({
      departmenCode: user?.department || "",
    }, {
      enabled: false
    })
    return (
        <div className=" rounded-lg w-full mt-5 relative space-y-3">
        <FormField
            control={form.control}
            name="courseCode"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Select Course</FormLabel>
                <Select disabled={selectableCoursesIsLoading || state?.upsertStudent !== "create"} onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {
                            selectableCourses?.map((type)=><SelectItem className="py-4" key={type.value} value={type.value}><span className=" text-start text-nowrap">{type.label}</span></SelectItem>)
                        }
                        </SelectContent>
                </Select>
                <FormDescription>
                This is the course of the student.
                </FormDescription>
                    {/* <FormMessage className=" absolute -bottom-5" /> */}
                </FormItem>
            )}
            />
            <FormField
                control={form.control}
                name="studentID"
                render={({ field }) => (
                    <FormItem className=" relative">
                        <FormLabel>Student ID</FormLabel>
                        <FormControl>
                            <Input placeholder="Input student ID" className=" max-w-[200px]" {...field}/>
                        </FormControl>
                        <FormDescription>
                            {"This is for the student's ID"}
                        </FormDescription>
                        {/* <FormMessage className=" absolute -bottom-5" /> */}
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                    <FormItem className=" relative">
                        <FormLabel>First name</FormLabel>
                        <FormControl>
                            <Input placeholder="Input first name" {...field}/>
                        </FormControl>
                        <FormDescription>
                            This is the first name of the student.
                        </FormDescription>
                        {/* <FormMessage className=" absolute -bottom-5" /> */}
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="middleName"
                render={({ field }) => (
                    <FormItem className=" relative">
                        <FormLabel>Middle name</FormLabel>
                        <FormControl>
                            <Input placeholder="Input middle name" {...field}/>
                        </FormControl>
                        <FormDescription>
                            This is the middle name of the student.
                        </FormDescription>
                        {/* <FormMessage className=" absolute -bottom-5" /> */}
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                    <FormItem className=" relative">
                        <FormLabel>Last name</FormLabel>
                        <FormControl>
                            <Input placeholder="Input last name" {...field}/>
                        </FormControl>
                        <FormDescription>
                            This is the last name of the student.
                        </FormDescription>
                        {/* <FormMessage className=" absolute -bottom-5" /> */}
                    </FormItem>
                )}
            />
            <div className=" flex flex-row gap-5 items-center w-full">

            <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                    <FormItem className=" relative flex-1">
                        <FormLabel>Contact No. (Optional)</FormLabel>
                        <FormControl>
                            <Input placeholder="Input contact number" {...field}/>
                        </FormControl>
                        <FormDescription>
                            Contact no. of the student.
                        </FormDescription>
                        {/* <FormMessage className=" absolute -bottom-5" /> */}
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem className=" relative flex-1">
                        <FormLabel>Email Address (Optional)</FormLabel>
                        <FormControl>
                            <Input placeholder="Input email address" {...field}/>
                        </FormControl>
                        <FormDescription>
                        Email address of the student.
                        </FormDescription>
                        {/* <FormMessage className=" absolute -bottom-5" /> */}
                    </FormItem>
                )}
            />
            </div>
        </div>
    );
}

export default UpsertSubjectForm;