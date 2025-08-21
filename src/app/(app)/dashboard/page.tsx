"use client";

import { Message } from "@/model/User";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApiResponce } from "@/types/ApiRespoce";
import axios, { AxiosError } from "axios";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw } from "lucide-react";
import { MessageCard } from "@/components/MessageCard";

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);


  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');


  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponce>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessages as any);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponce>;
      toast(axiosError.response?.data.message ?? 'Failed to fetch message settings');
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponce>('/api/get-messages');
        setMessages(response.data.messages || []);
        if (refresh) {
          toast('Showing latest messages');
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponce>;
        toast(axiosError.response?.data.message ?? 'Failed to fetch messages');
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages, toast]
  );

  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();

    fetchAcceptMessages();
  }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponce>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponce>;
      toast(axiosError.response?.data.message ?? 'Failed to update message settings');
    }
  };

  if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast('Profile URL has been copied to clipboard.');
  };

  return (
<div className="flex justify-center items-center min-h-[86.2vh] md:min-h-[88.2vh] bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
  <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded-2xl shadow-lg w-full max-w-6xl">
    {/* Header */}
    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
      User Dashboard
    </h1>

    {/* Copy Unique Link */}
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">
        Copy Your Unique Link
      </h2>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={profileUrl}
          disabled
          className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
        <Button
          onClick={copyToClipboard}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition rounded-xl px-4 py-2 text-white font-medium shadow-md"
        >
          Copy
        </Button>
      </div>
    </div>

    {/* Switch */}
    <div className="mb-6 flex items-center">
      <Switch
        {...register("acceptMessages")}
        checked={acceptMessages}
        onCheckedChange={handleSwitchChange}
        disabled={isSwitchLoading}
      />
      <span className="ml-3 text-gray-700 font-medium">
        Accept Messages:{" "}
        <span className={acceptMessages ? "text-green-600" : "text-red-600"}>
          {acceptMessages ? "On" : "Off"}
        </span>
      </span>
    </div>

    <Separator />

    {/* Refresh Button */}
    <div className="mt-6 flex justify-end">
      <Button
        variant="outline"
        className="rounded-xl border-gray-300 hover:bg-gray-100 flex items-center gap-2"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
        ) : (
          <RefreshCcw className="h-4 w-4 text-gray-600" />
        )}
        Refresh
      </Button>
    </div>

    {/* Messages */}
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {messages.length > 0 ? (
        messages.map((message, index) => (
          <MessageCard
            key={message._id as any}
            message={message}
            onMessageDelete={handleDeleteMessage}
          />
        ))
      ) : (
        <p className="text-gray-500 text-center col-span-2 py-6">
          No messages to display.
        </p>
      )}
    </div>
  </div>
</div>

  )
}

export default UserDashboard;