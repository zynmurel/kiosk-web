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
import { type SubjectsSelectedType } from "../page"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

const FormSchema = z.object({
    subjectId: z.coerce.number({
        message: "Subject units is required.",
    }),
    instructorId: z.coerce.number({
        message: "Subject units is required.",
    })
})

export function AddSubjectDialog({ open, setOpen, setSubjectsSelected, subjectsSelected}: { 
    open: boolean; 
    setOpen: Dispatch<SetStateAction<boolean>>, 
    setSubjectsSelected: Dispatch<SetStateAction<SubjectsSelectedType[]| undefined>>,
    subjectsSelected:SubjectsSelectedType[] | undefined
}) {
    const { user } = useStore()
    const [searchSubject, setSearchSubject] = useState("")
    const [searchInstructor, setSearchInstructor] = useState("")
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    const { data: instructors, isLoading: instructorsIsLoading } = api.admin.global.getSelectableInstructors.useQuery({
        departmentCode: user?.department || "",
    }, {
        enabled: false
    })

    const { data: subjects, isLoading: subjectsIsLoading } = api.admin.global.getSelectableSubjects.useQuery({
        departmentCode: user?.department || "",
    }, {
        enabled: false
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        if(subjectsSelected?.find(sub=>sub.subjectId === data.subjectId)){
            toast({
                variant : "destructive",
                title : "Failed to add.",
                description : "Subject already in the curriculum"
            })
            form.setError("subjectId",{ message:  "This subject already in the curriculum"})
        }else {
            setSubjectsSelected((prev)=>[data, ...(prev||[])])
            setOpen(false)
            form.reset()
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
                <Toaster/>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Add Subject</DialogTitle>
                    <DialogDescription>
                        Add subject and assign instructor.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="subjectId"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Subjects</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        disabled={subjectsIsLoading}
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            "w-full justify-between",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value
                                                            ? subjects?.find(
                                                                (subject) => subject.id === field.value
                                                            )?.label
                                                            : "Select Subject"}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[450px] p-0">
                                                <Command>
                                                    <CommandInput
                                                        placeholder="Search Subject Code"
                                                        className="h-9"
                                                        onValueChange={(e)=>setSearchSubject(e)}
                                                        value={searchSubject}
                                                    />
                                                    <CommandList>
                                                        <CommandEmpty>No subject found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {subjects?.filter(sub=>sub.code.includes(searchSubject)).map((subject) => (
                                                                <CommandItem
                                                                    key={subject.id}
                                                                    onSelect={() => {
                                                                        form.setValue("subjectId", subject.id)
                                                                    }}
                                                                >
                                                                    {subject.label}
                                                                    <CheckIcon
                                                                        className={cn(
                                                                            "ml-auto h-4 w-4",
                                                                            subject.id === field.value
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormDescription>
                                            Select subject to add into the curriculum.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="instructorId"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Instructor</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        disabled={instructorsIsLoading}
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            "w-full justify-between",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value
                                                            ? instructors?.find(
                                                                (instructor) => instructor.id === field.value
                                                            )?.label
                                                            : "Select Instructor"}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[450px] p-0">
                                                <Command>
                                                    <CommandInput
                                                        placeholder="Search Instructor Employee ID"
                                                        className="h-9"
                                                        onValueChange={(e)=>setSearchInstructor(e)}
                                                        value={searchInstructor}
                                                    />
                                                    <CommandList>
                                                        <CommandEmpty>No instructor found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {instructors?.filter(sub=>sub.employeeID.includes(searchInstructor)).map((instructor) => (
                                                                <CommandItem
                                                                    key={instructor.id}
                                                                    onSelect={() => {
                                                                        form.setValue("instructorId", instructor.id)
                                                                    }}
                                                                >
                                                                    {instructor.label}
                                                                    <CheckIcon
                                                                        className={cn(
                                                                            "ml-auto h-4 w-4",
                                                                            instructor.id === field.value
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormDescription>
                                            Select instructor to add into the curriculum.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className=" w-full flex justify-end">
                            <Button>Add Subject</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog >
    )
}
