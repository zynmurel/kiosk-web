"use client"

import { useFormContext } from "react-hook-form"
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
const UpdateCourseForm = ({isEdit}:{isEdit:boolean}) => {
    const form = useFormContext()
    return (
        <div className=" rounded-lg w-full mt-5 relative space-y-3">
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem className=" relative">
                                <FormLabel>Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="Input course code" className=" max-w-[200px]" {...field} disabled={!isEdit} />
                                </FormControl>
                                <FormDescription>
                                    This is the code of the course.
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
                                    <Input placeholder="Input course title" {...field} disabled={!isEdit} />
                                </FormControl>
                                <FormDescription>
                                    This is the title of the course.
                                </FormDescription>
                                <FormMessage className=" absolute -bottom-5" />
                            </FormItem>
                        )}
                    />
        </div>
    );
}

export default UpdateCourseForm;