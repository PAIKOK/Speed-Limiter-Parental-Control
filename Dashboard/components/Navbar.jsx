"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkAuth = () => {
    setIsLoggedIn(!!localStorage.getItem("userId"));
  };

  useEffect(() => {
    // Initial check
    checkAuth();

    // Listen for login/logout events
    window.addEventListener("auth-change", checkAuth);

    return () => {
      window.removeEventListener("auth-change", checkAuth);
    };
  }, []);

  const logoutFn = () => {
    localStorage.removeItem("sessionToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");

    // 🔔 notify navbar
    window.dispatchEvent(new Event("auth-change"));

    router.push("/login");
  };

  return (
    <nav className="w-full bg-slate-900 text-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-2xl font-bold text-blue-400">
          SpeedLimiter 🚗⚡
        </Link>

        <ul className="hidden md:flex gap-6 text-sm">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>

        {isLoggedIn && (
          <div className="hidden md:flex gap-3">
            <Link
              href="/dashboard"
              className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Dashboard
            </Link>

            <Link
              href="/profile"
              className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Profile
            </Link>

            <button
              onClick={logoutFn}
              className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
