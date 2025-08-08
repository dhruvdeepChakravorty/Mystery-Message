"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { signupSchema, usernameValidation } from "@/Schemas/signupSchema";
import axios, { AxiosError } from "axios";
import { apiResponce } from "@/types/apiResponce";
import { toast } from "sonner";
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
import { Loader2 } from "lucide-react";

const page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const debounced = useDebounceCallback(setUsername, 500);
  const router = useRouter();
  // zod implementaion
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  useEffect(() => {
    const checkUsernameUniqueness = async () => {
      const trimmed = username.trim();

      // Do not call API for empty username
      if (!trimmed) {
        setUsernameMessage("");
        return;
      }

      // Client-side validate first to avoid unnecessary API calls
      const validation = usernameValidation.safeParse(trimmed);
      if (!validation.success) {
        const firstError = validation.error.format()._errors?.[0] ??
          "Invalid username";
        setUsernameMessage(firstError);
        return;
      }

      setIsCheckingUsername(true);
      setUsernameMessage("");
      try {
        const response = await axios.get(
          `/api/check-username-unique?username=${encodeURIComponent(trimmed)}`
        );
        setUsernameMessage(response.data.message);
      } catch (error) {
        const axiosError = error as AxiosError<apiResponce>;
        setUsernameMessage(
          axiosError.response?.data?.message ?? "Error while checking username"
        );
      } finally {
        setIsCheckingUsername(false);
      }
    };
    checkUsernameUniqueness();
  }, [username]);
  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmittingForm(true);
    try {
      const response = await axios.post("/api/sign-up", data);
      toast("Successfully signed up", { description: response.data.message });
      router.replace(`/verify/${username}`);
    } catch (error) {
      console.error("Error in onSubmit", error);
      const axiosError = error as AxiosError<apiResponce>;
      const errorMessage = axiosError.response?.data.message;
      toast("Error in Sign- up", { description: errorMessage });
    } finally {
      setIsSubmittingForm(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8  space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign Up to start a anonymous journey</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  <p
                    className={`text-sm ${usernameMessage === "Username is Unique" ? "text-green-500" : "text-red-500"}`}
                  >
                    {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
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
            <Button type="submit" disabled={isSubmittingForm}>
              {isSubmittingForm ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"></Loader2>
                  Please Wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
          <div className="text-center mt-4">
            <p>
              Already a Member?{" "}
              <Link
                href={"/sign-in"}
                className="text-blue-500 hover:text-blue-800"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default page;
