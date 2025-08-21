'use-client'
import { Message } from "@/model/User";
import { useSession } from "next-auth/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApiResponce } from "@/types/ApiRespoce";
import axios, { AxiosError } from "axios";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";

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

  

  return(
    <div>
      dashboard
    </div>
  )
}