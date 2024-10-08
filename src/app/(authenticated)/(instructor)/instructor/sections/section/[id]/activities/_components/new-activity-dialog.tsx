import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea";
import { type Dispatch, type SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/trpc/react";
import { useParams, useRouter } from "next/navigation";

const activityTypes = [{
  value: "EXAM",
  label: "EXAM"
}, {
  value: "QUIZ",
  label: "QUIZ"
}, {
  value: "ASSIGNMENT",
  label: "ASSIGNMENT"
}, {
  value: "PROJECT",
  label: "PROJECT"
}, {
  value: "OTHERS",
  label: "OTHERS"
}, {
  value: "MAJOR_EXAM",
  label: "MAJOR EXAM"
}, {
  value: "MAJOR_COURSE_OUTPUT",
  label: "MAJOR COURSE OUTPUT"
}]
export function NewActivityDialog({ open, setOpen, refetchActivities }: { open: boolean; setOpen: Dispatch<SetStateAction<boolean>>;refetchActivities: () => Promise<void>}) {
  const {id} = useParams()
  const router = useRouter()
  const FormSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    settedRedeemablePoints: z.coerce.number().optional(),
    totalPossibleScore: z.coerce.number().min(1, {message : "Can't be zero or below"}),
    activity_type: z.enum(["MAJOR_EXAM", "MAJOR_COURSE_OUTPUT", "EXAM", "QUIZ", "ASSIGNMENT", "PROJECT", "OTHERS"])
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues : {
      totalPossibleScore : 0
    }
  })

  const { mutateAsync:createActivity, isPending:createActivityIsPending} = api.instructor.section.createActivity.useMutation({
    onSuccess : async (data)=>{
      router.push(`activities/${data.id}`)
      await refetchActivities()
    }
  })
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if(!Number.isNaN(Number(id))){
      await createActivity({
        sectionId:Number(id),
        ...data
      })
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Activity</DialogTitle>
          <DialogDescription>{"Create a new activity to record your students' scores."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="activity_type"
              render={({ field }) => (
                <FormItem className=" relative">
                  <FormLabel>Activity Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {
                        activityTypes.map((sy) => {
                          return <SelectItem key={sy.value} value={sy.value.toString()}>{sy.label}</SelectItem>
                        })
                      }
                    </SelectContent>
                  </Select>
                  <FormMessage className=" absolute -bottom-5" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className=" relative">
                  <FormLabel>Activity Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Input activity title" {...field} />
                  </FormControl>
                  <FormMessage className=" absolute -bottom-5" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className=" relative">
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Input activity description" {...field} />
                  </FormControl>
                  <FormMessage className=" absolute -bottom-5" />
                </FormItem>
              )}
            />
            <div className=" flex flex-row gap-5 items-start w-full">

            <FormField
              control={form.control}
              name="totalPossibleScore"
              render={({ field }) => (
                <FormItem className=" w-full relative">
                  <FormLabel>Highest Possible Score</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Activity's total score" {...field} />
                  </FormControl>
                  <FormMessage className=" absolute -bottom-5" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="settedRedeemablePoints"
              render={({ field }) => (
                <FormItem className=" w-full relative">
                  <FormLabel>Redeemable Points (Optional)</FormLabel>
                  <FormControl>
                  <Input type="number" placeholder="Activity's total score" {...field} />
                  </FormControl>
                  <FormMessage className=" absolute -bottom-5" />
                </FormItem>
              )}
            />
            </div>
            <div className=" text-sm text-orange-500 mt-5">Note : Default redeemable points will be used if no points are entered.</div>
            <Button className="" disabled={createActivityIsPending}>Create Activity</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
