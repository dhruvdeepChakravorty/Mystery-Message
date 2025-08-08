"use client";


import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import React, { useState } from "react";

import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInSchema } from "@/Schemas/signInSchema";
import {signIn} from 'next-auth/react'
import { toast } from "sonner";

const page = () => {
 
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const router = useRouter();
  // zod implementaion
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  
  });
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmittingForm(true);
  
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
  
    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast("Incorrect Username Or Password");
      } else {
        toast("Error Occurred");
      }
    }
  
    if (result?.url) {
      router.replace("/dashboard");
    }
  
    setIsSubmittingForm(false); 
  }; 
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8  space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign in to start a anonymous journey</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
           
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username / Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Username / Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Sign In</Button>
          </form>
          <div className="text-center mt-4">
            <p>
              Not a Member?{" "}
              <Link
                href={"/sign-up"}
                className="text-blue-500 hover:text-blue-800" 
              >Sign up</Link>
            </p>
          </div>
          

        </Form>
      </div>
    </div>
    
  );
};

export default page;

