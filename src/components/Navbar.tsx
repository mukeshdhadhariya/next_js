'use client'

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';
import { redirect } from 'next/navigation';

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Logo / Brand */}
        <a href="#" className="text-2xl font-extrabold tracking-tight mb-4 md:mb-0">
          True Feedback
        </a>

        {/* Auth Section */}
        {session ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-300 text-sm md:text-base">
              Welcome, <span className="font-semibold text-white">{user.username || user.email}</span>
            </span>
            <Button
              onClick={() =>signOut()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition rounded-lg px-4 py-2 font-medium text-white shadow-md"
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/sign-in">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition rounded-lg px-4 py-2 font-medium text-white shadow-md">
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;