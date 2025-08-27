'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounceCallback } from 'usehooks-ts'
import * as z from 'zod';
import { toast } from "sonner"
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';
import axios, { AxiosError } from 'axios'
import { ApiResponce } from '@/types/ApiRespoce';
import { Loader2 } from 'lucide-react'

export default function SignUpForm() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 500);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    }
  });

  // check username uniqueness
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage('');
        try {
          const response = await axios.get<ApiResponce>(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponce>;
          setUsernameMessage(
            axiosError.response?.data.message ?? 'Error checking username'
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  // handle submit
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/sign-up', data);

      toast.success(response.data.message);
      router.replace(`/verify/${username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponce>;
      let errorMessage =
        axiosError.response?.data.message ??
        'There was a problem with your sign-up. Please try again.';

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="w-full max-w-md p-6 space-y-6 bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-white">
            Join True Feedback 🚀
          </h1>
          <p className="text-gray-300 text-sm md:text-base">
            Sign up to start your anonymous adventure
          </p>
        </div>

        {/* Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-200">Username</label>
            <div className="flex items-center gap-2 mt-1">
              <input
                {...form.register("username")}
                placeholder="Enter your username"
                className="flex-1 px-3 py-2 rounded-lg bg-gray-900/60 border border-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                  form.setValue("username", e.target.value);
                  debounced(e.target.value);
                }}
              />
              {isCheckingUsername && (
                <Loader2 className="animate-spin h-5 w-5 text-gray-400" />
              )}
            </div>
            <div className="min-h-[18px] text-sm mt-1">
              {isCheckingUsername ? (
                <p className="text-gray-400">Checking username...</p>
              ) : usernameMessage ? (
                <p
                  className={
                    usernameMessage === 'Username is unique'
                      ? 'text-green-400'
                      : 'text-red-400'
                  }
                >
                  {usernameMessage}
                </p>
              ) : null}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-200">Email</label>
            <input
              {...form.register("email")}
              placeholder="Enter your email"
              className="w-full px-3 py-2 rounded-lg bg-gray-900/60 border border-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-gray-400 text-xs mt-1">
              We’ll send you a verification code
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-200">Password</label>
            <input
              type="password"
              {...form.register("password")}
              placeholder="Create a strong password"
              className="w-full px-3 py-2 rounded-lg bg-gray-900/60 border border-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center items-center gap-2 py-2 px-4 rounded-xl font-semibold text-white shadow-md transition 
          ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90'}`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Signing Up...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Already a member?{' '}
            <Link
              href="/sign-in"
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>

  );
}
