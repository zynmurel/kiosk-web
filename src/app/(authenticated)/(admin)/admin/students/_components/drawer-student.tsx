'use client'
import { useStore } from "@/lib/store/app";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
} from "@/components/ui/form"
import * as React from "react"
import { PlusCircle, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useStudentContext } from "@/lib/context/student"
import UpsertStudentForm from "./upsert-form"
import { api } from "@/trpc/react";
import Loading from "./loading";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export const FormSchema = z.object({
  courseCode: z.string(),
  studentID: z.string().min(1, {
    message: "Student ID is required",
  }),
  firstName: z.string().min(1, {
    message: "First name is required",
  }),
  middleName: z.string().min(1, {
    message: "Middle name is required",
  }),
  lastName: z.string().min(1, {
    message: "Last name is required",
  }),
  contact: z.string().optional(),
  email: z.string().optional(),
})

export default function UpsertStudentDrawer() {
  const { user } = useStore()
  const state = useStudentContext()
  const isCreate = state?.upsertStudent === "create"

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const { mutateAsync, isPending } = api.admin.student.upsertStudent.useMutation({
    onSuccess: async () => {
      toast({
        title: "Success!",
        description: isCreate ? "New Student added successfully!" : "Student updated successfully!"
      })
      await Promise.all([
        await state?.refetchStudents()
        // data.id === Number(id) && refetchSelectedSubject()
      ])
      state?.setUpsertStudent(undefined)
      form.reset()
    },
    onError: (e) => {
      if (e.message.includes("Unique constraint failed on the fields")) {
        toast({
          variant: "destructive",
          title: "Failed",
          description: "Student ID already exist."
        })
        form.setError("studentID", { message: "Student ID already exist." })
      } else {
        toast({
          variant: "destructive",
          title: "Failed",
          description: e.message
        })
      }
    }
  })

  useEffect(()=>{
    if(!!state?.upsertStudent && state?.upsertStudent !=="create") {
      const {
        courseCode,
        firstName,
        lastName,
        middleName,
        studentID,
        contact,
        email
      } = state.upsertStudent
      form.setValue("courseCode", courseCode)
      form.setValue("firstName", firstName)
      form.setValue("lastName", lastName)
      form.setValue("middleName", middleName || "")
      form.setValue("studentID", studentID)
      form.setValue("contact", !!contact?.length ? contact : undefined)
      form.setValue("email", !!email?.length ? email : undefined)
    }else {
      form.reset()
    }
  },[form, state?.upsertStudent])

  if (!state) {
    return
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      if (user?.department) {
        if(state?.upsertStudent === "create"){
          await mutateAsync({
            id: 0,
            departmentCode : user.department,
            ...data
          })
        } else if(!!state?.upsertStudent?.id){
          await mutateAsync({
            id: state.upsertStudent.id,
            departmentCode : user.department,
            ...data
          })
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  const { upsertStudent, setUpsertStudent } = state

  const handleClose = () => {
    setUpsertStudent(undefined)
    form.clearErrors()
  }

  return (
    <Drawer direction="left" open={!!upsertStudent} onClose={handleClose}>
      <Toaster />
      <Button className="gap-1" type="button" variant={"outline"} onClick={() => setUpsertStudent("create")}>
        <PlusCircle className="h-4 w-4" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Add Student
        </span>
      </Button>
      <DrawerContent className=" w-full sm:w-[550px] h-screen overflow-y-scroll no-scrollbar">
        {(isPending) &&
          <div className=" absolute bg-background opacity-50 z-10 top-0 left-0 right-0 bottom-0 flex items-center justify-center">
            <Loading />
          </div>}
        <div className="w-full px-5">
          <Button variant={"ghost"} onClick={handleClose} className=" absolute right-2 top-2"><X /></Button>
          <DrawerHeader className=" p-0 pt-2">
            <DrawerTitle>{isCreate ? "Add" : "Update"} Student</DrawerTitle>
            <DrawerDescription>{isCreate ? `Add new student in ${user?.department?.toUpperCase()} Department` : "Update student's details."}</DrawerDescription>
          </DrawerHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">

              <UpsertStudentForm />
              <div className=" flex flex-row items-center mt-8 justify-end gap-2">
                <Button onClick={handleClose} className=" w-32" type="button" variant="outline">Cancel</Button>
                <Button className=" w-32" >Submit</Button>
              </div>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
