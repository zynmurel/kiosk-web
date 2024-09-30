"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { loginAdmin, loginStudent } from "@/lib/api-helper/auth";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "student Id must be at least 6 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  role: z.enum(["student"]),
});

 const LoginCard  = () => {
  const [loginLoading, setLoginLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
      role: "student",
    },
  });

  const handleSubmit = async ({
    username,
    password,
    role,
  }: {
    username: string;
    password: string;
    role: "student";
  }) => {
    const data = await loginStudent({
      username,
      password,
      role,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (data.status === 200) {
      window.location.href = `/${role}`;
    } else {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Please input correct credentials.",
      });
    }
    return data;
  };
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoginLoading(true);
      return await handleSubmit({
        username: data.username,
        password: data.password,
        role: data.role,
      })
        .then((data) => {
          if (data.status === 200) {
            toast({
              title: "Success login",
              description: "Welcome student.",
            });
            window.location.href = `/student`;
          }
        })
        .finally(() => {
          setLoginLoading(false);
        });
    } catch (e) {
      console.log(e);
      setLoginLoading(false);
      toast({
        variant: "destructive",
        title: "User not found",
        description: "Please input correct credentials.",
      });
    }
  }

  return (
    <Card className="m-1 w-full rounded-xl px-1 sm:m-5 sm:p-2 sm:px-7 md:w-[450px] lg:w-[450px]">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">LOGIN</CardTitle>
        <CardDescription className="text-sm">{`Login as an student of LEarn App.`}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Student ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Input student  id" {...field} />
                  </FormControl>
                  <FormMessage className="absolute -bottom-5" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Input password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="absolute -bottom-5" />
                </FormItem>
              )}
            />
            <div className="py-5">
              <Button type="submit" disabled={loginLoading} className="w-full">
                Login
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default LoginCard
