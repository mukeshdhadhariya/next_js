'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import { useCompletion } from '@ai-sdk/react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner'
import * as z from 'zod';
import { ApiResponce } from '@/types/ApiRespoce';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

export default function SendMessage() {

  const [completion, setCompletion] = useState<string>("What's your favorite movie?||Do you have any pets?||What's your dream job?");
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const params = useParams<{ username: string }>();
  const username = params.username;


  console.log(completion)

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {

      const response = await axios.post<ApiResponce>('/api/send-messages', {
        ...data,
        username,
      });

      toast(response.data.message);
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponce>;
      toast(axiosError.response?.data.message ?? 'Failed to sent message');
    } finally {
      setIsLoading(false);
    }
  };

const fetchSuggestedMessages = async () => {
    try {
      setIsSuggestLoading(true);
      setError(null);

      const res = await axios.post("/api/suggest-messages");

      setCompletion(res.data.completion);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsSuggestLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-3 sm:px-4">
      <div className="w-full my-6 sm:my-10 p-4 sm:p-6 md:p-8 bg-white rounded-2xl shadow-lg max-w-6xl">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6 sm:mb-8 text-center text-gray-900">
          Public Profile Link
        </h1>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Left: Form */}
          <Card className="rounded-xl shadow-md">
            <CardHeader>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Send Anonymous Message
              </h2>
              <p className="text-gray-500 text-sm sm:text-base">to @{username}</p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-gray-700">Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write your anonymous message here..."
                            className="resize-none min-h-[100px] sm:min-h-[120px] rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    {isLoading ? (
                      <Button
                        disabled
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-md w-full sm:w-auto"
                      >
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isLoading || !messageContent}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition text-white rounded-lg shadow-md w-full sm:w-auto"
                      >
                        Send It
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Right: Suggested Messages */}
          <Card className="rounded-xl shadow-md lg:sticky lg:top-8 h-fit">
            <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Suggested Messages
              </h3>
              <Button
                onClick={fetchSuggestedMessages}
                disabled={isSuggestLoading}
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-sm hover:opacity-90 transition w-full sm:w-auto"
              >
                {isSuggestLoading ? "Loading..." : "Refresh"}
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col space-y-2 sm:space-y-3">
              {error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                parseStringMessages(completion).map((message, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start text-left rounded-lg border-gray-300 hover:bg-gray-100 transition text-sm sm:text-[13px] whitespace-normal break-words w-full"
                    onClick={() => handleMessageClick(message)}
                  >
                    {message}
                  </Button>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Separator className="my-8 sm:my-10" />
        <div className="text-center space-y-3 sm:space-y-4">
          <p className="text-base sm:text-lg text-gray-600">
            Want your own Message Board?
          </p>
          <Link href="/sign-up">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition text-white rounded-lg shadow-md px-5 sm:px-6 py-2 sm:py-3 font-semibold w-full sm:w-auto"
            >
              Create Your Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}