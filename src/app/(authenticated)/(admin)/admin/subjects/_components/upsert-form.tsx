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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
const subject_type = [{
    value : "MINOR",
    label : "Minor"
},{
    value : "MAJOR",
    label : "Major"
}]
const UpsertSubjectForm = ({isEdit=true}:{isEdit?:boolean}) => {
    const form = useFormContext()
    const type = form.getValues()
    return (
        <div className=" rounded-lg w-full mt-5 relative space-y-3">
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem className=" relative">
                                <FormLabel>Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="Input subject code" className=" max-w-[200px]" {...field} disabled={!isEdit} />
                                </FormControl>
                                <FormDescription>
                                    This is the code of the subject.
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
                                    <Input placeholder="Input subject title" {...field} disabled={!isEdit} />
                                </FormControl>
                                <FormDescription>
                                    This is the title of the subject.
                                </FormDescription>
                                <FormMessage className=" absolute -bottom-5" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className=" relative">
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Input subject description" {...field} disabled={!isEdit} />
                                </FormControl>
                                <FormDescription>
                                    This is the description of the subject.
                                </FormDescription>
                                <FormMessage className=" absolute -bottom-5" />
                            </FormItem>
                        )}
                    />
                    <div className=" grid grid-cols-2 gap-5">
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Type</FormLabel>
                            {!isEdit ? <div className=" text-sm">{type.type}</div> : <Select onValueChange={field.onChange} value={field.value} disabled={!isEdit} >
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {
                                        subject_type.map((type)=><SelectItem className="py-4" key={type.value} value={type.value}>{type.label}</SelectItem>)
                                    }
                                    </SelectContent>
                            </Select>}
                            {/* <FormDescription>
                            Select subject type
                            </FormDescription> */}
                                <FormMessage className=" absolute -bottom-5" />
                            </FormItem>
                        )}
                        />
                        <FormField
                            control={form.control}
                            name="units"
                            render={({ field }) => (
                                <FormItem className=" relative">
                                    <FormLabel>Units</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Input units" {...field} disabled={!isEdit} />
                                    </FormControl>
                                    {/* <FormDescription>
                                        This is the description of the subject.
                                    </FormDescription> */}
                                    <FormMessage className=" absolute -bottom-5" />
                                </FormItem>
                            )}
                        />
                    </div>
        </div>
    );
}

export default UpsertSubjectForm;