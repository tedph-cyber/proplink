"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/dashboard";
  const confirmationFailed = searchParams.get("error") === "confirmation_failed";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(confirmationFailed ? "Email confirmation failed. Please try registering again." : "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        if (authError.message.includes("Email not confirmed")) {
          throw new Error("Please confirm your email before signing in. Check your inbox.");
        }
        if (authError.message.includes("Invalid login credentials")) {
          throw new Error("Invalid email or password. Please try again.");
        }
        throw authError;
      }
      if (data.user) {
        router.push(nextPath);
        router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-[400px] mx-auto bg-[var(--color-surface)] rounded-2xl shadow-[0_24px_48px_-12px_rgba(10,29,47,0.08)] p-8 flex flex-col"
    >
      {/* Brand */}
      <div className="flex flex-col items-center mb-8">
        <span className="font-display text-3xl font-bold tracking-tight text-[var(--color-text)]">StrongTower</span>
        <span className="text-[10px] font-bold tracking-[0.2em] text-[var(--color-accent)] uppercase">Holdings</span>
        <h1 className="mt-6 text-2xl font-bold text-[var(--color-text)] tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">Please enter your details to sign in</p>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-start gap-2"
          >
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-[0.05em] text-[var(--color-text-muted)]">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-[var(--color-surface-2)] border-none rounded-lg px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:bg-[var(--color-surface)] transition-all duration-300"
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-[11px] font-bold uppercase tracking-[0.05em] text-[var(--color-text-muted)]">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-[var(--color-surface-2)] border-none rounded-lg px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:bg-[var(--color-surface)] transition-all duration-300"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[var(--color-accent)] w-full py-3.5 rounded-xl text-white font-bold disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-[var(--color-border)]/20 text-center">
        <p className="text-sm text-[var(--color-text-muted)]">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-bold text-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors ml-1">
            Register
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-[400px] mx-auto p-8 flex justify-center">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
