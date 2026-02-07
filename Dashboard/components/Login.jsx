// frontend/pages/login.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      localStorage.setItem("sessionToken", data.sessionToken);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("email", data.email);
      window.dispatchEvent(new Event("auth-change"));

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Network error");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
      <form
        onSubmit={handleLogin}
        className="bg-slate-800 p-6 rounded-xl shadow w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold">Log in</h1>

        {error && (
          <div className="text-sm text-red-300 bg-red-900/40 rounded px-3 py-2">
            {error}
          </div>
        )}

        <div className="space-y-1 text-sm">
          <label className="block text-slate-300">Email</label>
          <input
            className="w-full rounded px-3 py-2 bg-slate-900 border border-slate-700 text-sm"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1 text-sm">
          <label className="block text-slate-300">Password</label>
          <input
            className="w-full rounded px-3 py-2 bg-slate-900 border border-slate-700 text-sm"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-sm font-semibold py-2 rounded"
        >
          Log in
        </button>

        <p className="text-xs text-slate-400">
          Need an account?{" "}
          <a href="/signup" className="text-emerald-400 underline">
            Sign up
          </a>
        </p>
      </form>
    </main>
  );
}
