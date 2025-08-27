'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signInSchema } from '@/schemas/signInSchema';
import { useState } from 'react';

export default function SignInForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      setLoading(true);
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          toast.error('Incorrect username or password');
        } else {
          toast.error(result.error);
        }
      }

      if (result?.url) {
        router.replace('/dashboard');
      }
    } catch (err) {
      toast.error('Something went wrong, please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="w-full max-w-md p-6 space-y-6 bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-white">
            Welcome Back <span className="inline-block">👋</span>
          </h1>
          <p className="text-gray-300 text-sm md:text-base mb-4">
            Sign in to continue your secret conversations
          </p>

          {/* Test IDs */}
          <div className="flex flex-col items-center gap-2">
            <h3 className="text-sm font-medium text-gray-200">Test Credentials</h3>
            <div className="flex flex-col gap-1 text-xs text-gray-300 bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700">
              <p><span className="font-semibold text-white">Username:</span> mukesh</p>
              <p><span className="font-semibold text-white">Password:</span> 12345678</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Email / Username</FormLabel>
                  <Input
                    {...field}
                    placeholder="Enter your email or username"
                    className="rounded-xl bg-gray-900/60 border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Password</FormLabel>
                  <Input
                    type="password"
                    {...field}
                    placeholder="Enter your password"
                    className="rounded-xl bg-gray-900/60 border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition rounded-xl py-2 font-semibold text-white shadow-md flex justify-center items-center"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Not a member yet?{' '}
            <Link
              href="/sign-up"
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>

  );
}
