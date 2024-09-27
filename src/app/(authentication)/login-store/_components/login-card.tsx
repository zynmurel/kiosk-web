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
import { loginAdmin, loginBusiness } from "@/lib/api-helper/auth";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),

});

 const LoginCard  = () => {
  const [loginLoading, setLoginLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),

  });

  const handleSubmit = async ({
    username,
    password,
    role,
  }: {
    username: string;
    password: string;
    role: string;
  }) => {
    const data = await loginBusiness({
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
        role: "company",
      })
        .then((data) => {
          if (data.status === 200) {
            toast({
              title: "Success login",
              description: "Welcome user.",
            });
                 window.location.href =`/company`;

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
        <CardDescription className="text-sm">{`Login as an store of LEarn App.`}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Input store username" {...field} />
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