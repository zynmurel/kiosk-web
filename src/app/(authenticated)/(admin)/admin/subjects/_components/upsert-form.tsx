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
    console.log(type)
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
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{isEdit && "Select "}Type</FormLabel>
                            {!isEdit ? <div className=" text-sm">{type.type}</div> : <Select onValueChange={field.onChange} value={field.value} disabled={!isEdit} >
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select subject type" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {
                                        subject_type.map((type)=><SelectItem className="py-4" key={type.value} value={type.value}>{type.label}</SelectItem>)
                                    }
                                    </SelectContent>
                            </Select>}
                            <FormDescription>
                            This is the type of the subject.
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
        </div>
    );
}

export default UpsertSubjectForm;