'use client'
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
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useStore } from "@/lib/store/app";
import { api } from "@/trpc/react";
import { type Dispatch, type SetStateAction, useState } from "react";
import { cn } from "@/lib/utils"
import { SectionAddedType, type SubjectsSelectedType } from "../page"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Input } from "@/components/ui/input"

const FormSchema = z.object({
    sectionName: z.string().min(1,{
        message: "Subject units is required.",
    }),
})

export function AddSectionDialog({ open, setOpen, setSectionAdded, sectionAdded}: { 
    open: boolean; 
    setOpen: Dispatch<SetStateAction<boolean>>, 
    setSectionAdded: Dispatch<SetStateAction<SectionAddedType[]| undefined>>,
    sectionAdded:SectionAddedType[] | undefined
}) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        setSectionAdded((prev) => [data, ...(prev || [])])
        setOpen(false)
        form.reset()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
                <Toaster/>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Add Section</DialogTitle>
                    <DialogDescription>
                        Add section to this curriculum.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            <FormField
                                control={form.control}
                                name="sectionName"
                                render={({ field }) => (
                                    <FormItem className=" relative">
                                        <FormLabel>Section name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Input section name" {...field}/>
                                        </FormControl>
                                        <FormDescription>
                                            {"This is the section name of the section you're going to add."}
                                        </FormDescription>
                                        {/* <FormMessage className=" absolute -bottom-5" /> */}
                                    </FormItem>
                                )}
                            />
                            <div className=" w-full flex justify-end">
                            <Button>Add Section</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog >
    )
}
