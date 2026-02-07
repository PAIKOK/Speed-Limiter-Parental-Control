"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    userId: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const email = localStorage.getItem("email");

    if (!userId || !email) {
      router.push("/login");
      return;
    }

    setUser({ userId, email });
  }, [router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-800 rounded-xl shadow-lg p-6 sm:p-8 text-white">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-400">
          My Profile
        </h1>

        {/* Profile Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-3xl font-bold">
            {user.email.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Profile Details */}
        <div className="space-y-4 text-sm sm:text-base">
          <div className="flex justify-between border-b border-slate-700 pb-2">
            <span className="text-slate-400">User ID</span>
            <span className="font-medium truncate max-w-[180px]">
              {user.userId}
            </span>
          </div>

          <div className="flex justify-between border-b border-slate-700 pb-2">
            <span className="text-slate-400">Email</span>
            <span className="font-medium truncate max-w-[180px]">
              {user.email}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Password</span>
            <span className="font-medium">••••••••</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full bg-blue-500 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => {
              localStorage.clear();
              router.push("/login");
            }}
            className="w-full bg-red-500 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
