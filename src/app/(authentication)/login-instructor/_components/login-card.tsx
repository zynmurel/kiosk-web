"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { loginInstructor } from "@/lib/api-helper/auth"

const FormSchema = z.object({username: z.string().min(2, {
  message: "Username must be at least 2 characters.",
}),
password: z.string().min(8, {
  message: "Password must be at least 8 characters.",
}),
})

export function LoginCard() {
  const [loginLoading, setLoginLoading] = useState(false)
  const {toast} = useToast()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const handleLogin = async ({ username, password, role }: { username: string; password: string; role : "instructor"}) => {
    const data = await loginInstructor({
      username,
      password,
      role
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (data.status === 200) {
      return data
    } else {
      toast({
        variant: "destructive",
        title: 'An error occurred',
        description: "Please input correct credentials."
      })
      throw new Error("Login Failed")
    }
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoginLoading(true)
      return await handleLogin({ username: data.username, password: data.password, role: "instructor" }).then((data) => {
        if (data?.status === 200) {
          toast({
            title: "Success login",
            description: "Welcome user."
          })
          window.location.href = '/instructor';
        }
      }).finally(() => {
        setLoginLoading(false)
      })
    } catch (e) {
      console.log(e)
      setLoginLoading(false)
      toast({
        variant: "destructive",
        title: "User not found",
        description: "Please input correct credentials."
      })
    }
  }

  return (
    <Card className="md:w-[450px] lg:w-[450px] w-full m-5 p-2 px-7 rounded-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">LOGIN</CardTitle>
        <CardDescription className="text-sm">{`Login as an administrator of LEarn App.`}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className=" relative">
                  <FormLabel>Employee ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Input employee ID" {...field} />
                  </FormControl>
                  <FormMessage className=" absolute -bottom-5" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className=" relative">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Input password" {...field} />
                  </FormControl>
                  <FormMessage className=" absolute -bottom-5" />
                </FormItem>
              )}
            />
            <div className=" py-5">
              <Button type="submit" disabled={loginLoading} className=" w-full">Login</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
