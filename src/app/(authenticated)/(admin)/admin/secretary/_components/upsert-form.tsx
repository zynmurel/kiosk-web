'use client'
import { useFormContext } from "react-hook-form"
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
const UpsertSecretaryForm = () => {
    const form = useFormContext()
    return (
        <div className=" rounded-lg w-full mt-5 relative space-y-3">
            <FormField
                control={form.control}
                name="employeeID"
                render={({ field }) => (
                    <FormItem className=" relative">
                        <FormLabel>Employee ID</FormLabel>
                        <FormControl>
                            <Input placeholder="Input secretary ID" className=" max-w-[200px]" {...field}/>
                        </FormControl>
                        <FormDescription>
                            {"This is for the secretary's employee ID"}
                        </FormDescription>
                        {/* <FormMessage className=" absolute -bottom-5" /> */}
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                    <FormItem className=" relative">
                        <FormLabel>Full name</FormLabel>
                        <FormControl>
                            <Input placeholder="Input first name" {...field}/>
                        </FormControl>
                        <FormDescription>
                            This is the full name of the secretary.
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
                            Contact no. of the secretary.
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
                        Email address of the secretary.
                        </FormDescription>
                        {/* <FormMessage className=" absolute -bottom-5" /> */}
                    </FormItem>
                )}
            />
            </div>
        </div>
    );
}

export default UpsertSecretaryForm;