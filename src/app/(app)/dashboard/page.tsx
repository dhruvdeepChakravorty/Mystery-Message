"use client";

import { Message } from "@/models/User.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AcceptMessageSchema } from "@/Schemas/messageAcceptSchema";
import axios, { AxiosError } from "axios";
import { apiResponce } from "@/types/apiResponce";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw } from "lucide-react";
import MessageCard from "@/components/MessageCard";

const page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeletedMessage = (messageId: String) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  }; // Uses optimistic UI approach, will show the message is deleted in UI but will be deleted later in backend
  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessage = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const responce = await axios.get("/api/accept-messages");
      setValue("acceptMessages", responce.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<apiResponce>;
      toast(
        axiosError.response?.data.message || "Failed TO Fetch Accept Messages"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const responce = await axios.get("/api/get-messages");
        setMessages(responce.data.message || []);
        if (refresh) {
          toast("Showing Refreshed Messages");
        }
      } catch (error) {
        const axiosError = error as AxiosError<apiResponce>;
        toast(axiosError.response?.data.message || "Failed TO Fetch Messages");
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );
  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, setValue, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const responce = await axios.post<apiResponce>("/api/accept-messages", {
        acceptMessage: !acceptMessage,
      });
      setValue("acceptMessages", !acceptMessage);
      toast(responce.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<apiResponce>;
      toast(
        axiosError.response?.data.message || "Failed TO change switch change"
      );
    }
  };

  const username = session?.user?.username;
  const profileUrl = new URL(
    `/u/${username}`,
    window.location.origin
  ).toString();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast("URL copied to clipboard");
  };

  if (!session || !session.user) {
    return (
      <div>
        {" "}
        <h1>Please Login</h1>
      </div>
    );
  }
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessage}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessage ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id as string}
              message={message}
              onMessageDelete={handleDeletedMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
};
export default page;
