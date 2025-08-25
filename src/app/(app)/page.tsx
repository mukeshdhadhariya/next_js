"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";

interface User {
  _id: string;
  username: string;
  email: string;
  isAcceptingMessages?: boolean;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (pageNum: number) => {
    setLoading(true);
    const res = await fetch(`/api/get-all-users?page=${pageNum}&limit=10`);
    const data = await res.json();
    setLoading(false);

    if (data.users.length > 0) {
      if (pageNum === 1) {
        setUsers(data.users);
      } else {
        setUsers((prev) => [...prev, ...data.users]);
      }
      setHasMore(pageNum < data.totalPages);
    } else {
      setHasMore(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 50 >=
        document.documentElement.scrollHeight
      ) {
        if (hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

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

        {/* Users List with Infinite Scroll */}
        <section className="mt-12 w-full max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">
            👥 All Users
          </h2>

          <div className="grid gap-4">
            {users.map((user) => (
              <Link key={user._id} href={`/u/${user.username}`}>
                <div className="flex items-center gap-4 p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition cursor-pointer">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <span className="text-lg font-semibold text-gray-600">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <h2 className="font-semibold text-lg text-gray-900">
                      {user.username}
                    </h2>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                  </div>

                  {/* Arrow Indicator */}
                  <span className="text-gray-400">➡️</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Loading Spinner */}
          {loading && (
            <p className="text-center mt-4 text-gray-400">
              Loading more users...
            </p>
          )}

          {/* End of list */}
          {!hasMore && !loading && (
            <p className="text-center mt-4 text-gray-500">No more users</p>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 md:p-6 bg-gray-950 text-gray-400 border-t border-gray-800">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-white">True Feedback</span>. All
          rights reserved.
        </p>
      </footer>
    </>
  );
}
