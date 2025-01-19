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
import { Button } from "@/components/ui/button"
const CreateCourseForm = () => {
    const form = useFormContext()
    return (
        <div className=" rounded-lg w-full mt-5 relative space-y-6">
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem className=" relative">
                                <FormLabel>Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="Input program code" className=" max-w-[200px]" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is for the code of the program.
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
                                    <Input placeholder="Input program title" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is for the title of the program.
                                </FormDescription>
                                <FormMessage className=" absolute -bottom-5" />
                            </FormItem>
                        )}
                    />
                    <div className="w-full flex justify-end gap-2">
                        <Button type="submit" className=" w-28">{"Create"} </Button>
                    </div>
        </div>
    );
}

export default CreateCourseForm;