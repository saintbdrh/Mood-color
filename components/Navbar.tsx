"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { FileText, LogIn, LogOut, User, Shield } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-900 border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-400" />
            <span className="font-bold text-xl">DocStore</span>
          </Link>

          <div className="flex items-center gap-4">
            {session?.user ? (
              <>
                <Link href="/my-orders" className="text-gray-300 hover:text-white text-sm">
                  My Orders
                </Link>
                <div className="flex items-center gap-2">
                  <img src={session.user.image || ""} alt="" className="w-8 h-8 rounded-full" />
                  <span className="text-sm text-gray-300 hidden sm:inline">{session.user.name}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-white"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
