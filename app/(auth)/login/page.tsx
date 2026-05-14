"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import styles from "@/styles/auth.module.css";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/dashboard";
  const confirmationFailed = searchParams.get("error") === "confirmation_failed";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      className="w-full max-w-[400px] mx-auto"
    >
      <div className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.brandName}>StrongTower</span>
          <span className={styles.brandAccent}>Holdings</span>
          <h1 className={styles.headingSpaced}>Welcome back</h1>
          <p className={styles.subtitle}>Please enter your details to sign in</p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={styles.bannerError}
            >
              <svg className={styles.bannerIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={styles.bannerMessage}>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <Link href="/forgot-password" className={styles.labelLink}>
                Forgot password?
              </Link>
            </div>
            <div className={styles.inputPasswordWrap}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.inputPassword}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.inputToggle}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className={styles.btnPrimary}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div className={styles.divider}>
          <p className={styles.footerText}>
            Don&apos;t have an account?{" "}
            <Link href="/register" className={styles.footerLink}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-[400px] mx-auto p-8 flex justify-center text-[var(--color-text-muted)] text-sm">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
