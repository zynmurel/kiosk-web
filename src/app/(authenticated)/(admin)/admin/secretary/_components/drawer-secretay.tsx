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
import UpsertSecretaryForm from "./upsert-form"
import { api } from "@/trpc/react";
import Loading from "./loading";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useSecretaryContext } from "@/lib/context/admin/secretary";

export const FormSchema = z.object({
  employeeID: z.string().min(1, {
    message: "Employee ID is required",
  }),
  fullName: z.string().min(1, {
    message: "Full name is required",
  }),
  contact: z.string().optional(),
  email: z.string().optional(),
})

export default function UpsertSecretaryDrawer() {
  const { user } = useStore()
  const state = useSecretaryContext()
  const isCreate = state?.upsertSecretary === "create"

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const { mutateAsync, isPending } = api.admin.secretary.upsertSecretary.useMutation({
    onSuccess: async () => {
      toast({
        title: "Success!",
        description: isCreate ? "New Secretary added successfully!" : "Secretary updated successfully!"
      })
      await Promise.all([
        await state?.refetchSecretarys()
        // data.id === Number(id) && refetchSelectedSubject()
      ])
      state?.setUpsertSecretary(undefined)
      form.reset()
    },
    onError: (e) => {
      if (e.message.includes("Unique constraint failed on the fields")) {
        toast({
          variant: "destructive",
          title: "Failed",
          description: "Employee ID already exist."
        })
        form.setError("employeeID", { message: "Employee ID already exist." })
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
    if(!!state?.upsertSecretary && state?.upsertSecretary !=="create") {
      const {
        fullName,
        employeeID,
        contact,
        email
      } = state.upsertSecretary
      form.setValue("employeeID", employeeID)
      form.setValue("fullName", fullName)
      form.setValue("contact", !!contact?.length ? contact : undefined)
      form.setValue("email", !!email?.length ? email : undefined)
    }else {
      form.reset()
    }
  },[form, state?.upsertSecretary])

  if (!state) {
    return
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      if (user?.department) {
        if(state?.upsertSecretary === "create"){
          await mutateAsync({
            id: 0,
            departmentCode : user.department,
            ...data
          })
        } else if(!!state?.upsertSecretary?.id){
          await mutateAsync({
            id: state.upsertSecretary.id,
            departmentCode : user.department,
            ...data
          })
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  const { upsertSecretary, setUpsertSecretary } = state

  const handleClose = () => {
    setUpsertSecretary(undefined)
    form.clearErrors()
  }

  return (
    <Drawer direction="left" open={!!upsertSecretary} onClose={handleClose}>
      <Toaster />
      <Button className="gap-1" type="button" variant={"outline"} onClick={() => setUpsertSecretary("create")}>
        <PlusCircle className="h-4 w-4" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Add Secretary
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
            <DrawerTitle>{isCreate ? "Add" : "Update"} Secretary</DrawerTitle>
            <DrawerDescription>{isCreate ? `Add new secretary in ${user?.department?.toUpperCase()} Department` : "Update secretary's details."}</DrawerDescription>
          </DrawerHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">

              <UpsertSecretaryForm />
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
