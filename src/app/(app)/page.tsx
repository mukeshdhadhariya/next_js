'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react'; // Assuming you have an icon for messages
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function Home() {
  return (
    <>
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        {/* Hero Section */}
        <section className="text-center mb-10 md:mb-14 max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Dive into the World of{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Anonymous Feedback
            </span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-gray-300">
            True Feedback – Where your identity remains{" "}
            <span className="font-semibold text-white">a secret 🔒</span>
          </p>
        </section>

        {/* Carousel for Messages */}
        <Carousel
          plugins={[Autoplay({ delay: 2500 })]}
          className="w-full max-w-lg md:max-w-2xl"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card className="rounded-2xl shadow-lg border border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {message.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-start gap-3 text-gray-700">
                    <Mail className="flex-shrink-0 text-blue-600" />
                    <div>
                      <p className="mb-1">{message.content}</p>
                      <p className="text-xs text-gray-500">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 md:p-6 bg-gray-950 text-gray-400 border-t border-gray-800">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-white">True Feedback</span>. All rights reserved.
        </p>
      </footer>
    </>

  );
}
