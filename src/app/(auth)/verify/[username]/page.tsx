'use client';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ApiResponce } from '@/types/ApiRespoce';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { verifySchema } from '@/schemas/verifySchema';
import Link from 'next/link';


export default function VerifyAccount() {

    const router = useRouter()
    const params = useParams<{ username: string }>()
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema)
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post<ApiResponce>(`/api/verify-code`, {
                username: params.username,
                code: data.code,
            });

            toast(response.data.message);

            router.replace('/sign-in');

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponce>;
            toast(axiosError.response?.data.message ?? 'An error occurred. Please try again.');
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 text-gray-900">
                        Verify Your Account
                    </h1>
                    <p className="text-gray-600 text-sm md:text-base">
                        Enter the 6-digit verification code sent to your email 📩
                    </p>
                </div>

                {/* Form */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <Input
                                        {...field}
                                        placeholder="Enter code"
                                        className="rounded-xl"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition rounded-xl py-2 font-semibold text-white shadow-md"
                        >
                            Verify
                        </Button>
                    </form>
                </Form>

                {/* Footer */}
                <div className="text-center mt-4">
                    <p className="text-gray-600 text-sm">
                        Didn’t receive the code?{" "}
                        <Link href="/sign-up" className="text-blue-600 hover:text-blue-800 font-medium">
                            Resend
                        </Link>
                    </p>
                </div>
            </div>
        </div>

    )
}
