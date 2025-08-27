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
    <div className="flex justify-center items-center min-h-[86vh] bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="my-6 mx-4 md:mx-8 lg:mx-auto p-6 bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg w-full max-w-6xl">

        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
          User Dashboard
        </h1>

        {/* Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Left: User Details */}
          <div className="space-y-6 md:col-span-1">
            {/* Copy Unique Link */}
            <div>
              <h2 className="text-lg font-semibold mb-3 text-gray-200">
                Copy Your Unique Link
              </h2>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={profileUrl}
                  disabled
                  className="w-full rounded-xl border border-gray-600 bg-gray-900/60 px-4 py-2 text-gray-100 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
            <div className="flex items-center">
              <Switch
                {...register("acceptMessages")}
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
              />
              <span className="ml-3 text-gray-300 font-medium">
                Accept Messages:{" "}
                <span className={acceptMessages ? "text-green-400" : "text-red-400"}>
                  {acceptMessages ? "On" : "Off"}
                </span>
              </span>
            </div>

            <Separator className="bg-gray-700" />

            {/* Refresh Button */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                className="rounded-xl border-gray-600 text-gray-200 hover:bg-gray-800 flex items-center gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  fetchMessages(true);
                }}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                ) : (
                  <RefreshCcw className="h-4 w-4 text-gray-400" />
                )}
                Refresh
              </Button>
            </div>
          </div>

          {/* Right: Messages */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-3 text-gray-200">Messages</h2>
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 h-[60vh] overflow-y-auto">
              {messages.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {messages.map((message, index) => (
                    <MessageCard
                      key={message._id as any}
                      message={message}
                      onMessageDelete={handleDeleteMessage}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-6">
                  No messages to display.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard;