"use client"

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, Target, Star, Shield, CheckCircle, MessageCircle, Home } from "lucide-react";
import { HomepageSearch } from "@/components/properties/homepage-search";
import Link from "next/link";

const ease = "easeOut" as const

const StatItem = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col items-center justify-center transition-transform hover:-translate-y-1 cursor-default">
    <span className="text-xl font-bold text-[var(--foreground)] sm:text-2xl">{value}</span>
    <span className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)] font-medium sm:text-xs">{label}</span>
  </div>
)

export default function HeroGlass() {
  return (
    <div className="relative w-full bg-gradient-to-br from-zinc-50 via-[#0568fd]/10 to-[#c379df]/10 dark:from-zinc-950 dark:via-[#0568fd]/10 dark:to-[#c379df]/10 text-[var(--foreground)] overflow-hidden font-sans">
      {/* Background Image with Gradient Mask */}
      <div
        className="absolute inset-0 z-0 bg-[url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80)] dark:bg-[url(https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1600&q=80)] bg-cover bg-center opacity-40 dark:opacity-25"
        style={{
          maskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
          WebkitMaskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6 md:pt-32 md:pb-20 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-start">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8 pt-8">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/80 dark:bg-white/5 px-3 py-1.5 backdrop-blur-md hover:bg-white/90 dark:hover:bg-white/10 transition-colors">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] flex items-center gap-2">
                  Trusted Platform
                  <Star className="w-3.5 h-3.5 text-[#ffcd75] fill-[#ffcd75]" />
                </span>
              </div>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tighter leading-[0.9]"
              style={{
                maskImage: "linear-gradient(180deg, black 0%, black 80%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(180deg, black 0%, black 80%, transparent 100%)",
              }}
            >
              Find Your Dream<br />
              <span className="bg-gradient-to-br from-[#0568fd] via-[#5247c8] to-[#c379df] bg-clip-text text-transparent">
                Property
              </span><br />
              Starts Here
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.2 }}
              className="max-w-xl text-lg text-[var(--muted-foreground)] leading-relaxed"
            >
              Browse verified listings, connect directly with sellers, and discover
              properties that match your lifestyle and budget across Nigeria.
            </motion.p>

            {/* Search Component */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.3 }}
            >
              <HomepageSearch />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/properties">
                <button className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#0568fd] to-[#c379df] px-8 py-4 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-[#0568fd]/40 active:scale-[0.98] w-full sm:w-auto">
                  Browse Properties
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
              <button className="group inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-white/70 dark:bg-white/5 px-8 py-4 text-sm font-semibold text-[var(--foreground)] backdrop-blur-sm hover:bg-white/90 dark:hover:bg-white/10 transition-colors w-full sm:w-auto">
                <Play className="w-4 h-4 fill-current" />
                How It Works
              </button>
            </motion.div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-5 space-y-6 lg:mt-12">

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.25 }}
              className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-white/85 dark:bg-white/5 p-8 backdrop-blur-xl shadow-2xl"
            >
              <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-[#0568fd]/20 blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0568fd] to-[#c379df] ring-1 ring-white/20">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold tracking-tight text-[var(--foreground)]">500+</div>
                    <div className="text-sm text-[var(--muted-foreground)]">Properties Listed</div>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--muted-foreground)]">Client Satisfaction</span>
                    <span className="text-[var(--foreground)] font-medium">98%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--muted)]">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-[#0568fd] to-[#c379df]"
                      initial={{ width: 0 }}
                      animate={{ width: "98%" }}
                      transition={{ delay: 0.9, duration: 1, ease }}
                    />
                  </div>
                </div>

                <div className="h-px w-full bg-[var(--border)] mb-6" />

                <div className="grid grid-cols-3 gap-4 text-center">
                  <StatItem value="50+" label="Sellers" />
                  <div className="w-px h-full bg-[var(--border)] mx-auto" />
                  <StatItem value="24/7" label="Support" />
                  <div className="w-px h-full bg-[var(--border)] mx-auto" />
                  <StatItem value="100%" label="Verified" />
                </div>

                <div className="mt-8 flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-white/70 dark:bg-white/5 px-3 py-1 text-[10px] font-medium tracking-wide text-[var(--muted-foreground)]">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                    ACTIVE
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-white/70 dark:bg-white/5 px-3 py-1 text-[10px] font-medium tracking-wide text-[var(--muted-foreground)]">
                    <Shield className="w-3 h-3 text-[#0568fd]" />
                    VERIFIED
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Trust Features Card */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.4 }}
              className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-white/85 dark:bg-white/5 p-8 backdrop-blur-xl"
            >
              <h3 className="mb-6 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Why Choose PropLink</h3>
              <div className="space-y-4">
                {[
                  { icon: CheckCircle, color: "#0568fd", title: "Browse Freely", desc: "No registration required" },
                  { icon: MessageCircle, color: "#c379df", title: "Direct Contact", desc: "WhatsApp sellers instantly" },
                  { icon: Home, color: "#ffcd75", title: "Verified Listings", desc: "Quality guaranteed" },
                ].map(({ icon: Icon, color, title, desc }) => (
                  <div key={title} className="flex items-start gap-3 group cursor-default transition-transform hover:translate-x-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/70 dark:bg-white/10 ring-1 ring-[var(--border)] group-hover:bg-white/90 dark:group-hover:bg-white/20 transition-colors">
                      <Icon className="h-4 w-4" style={{ color }} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--foreground)]">{title}</div>
                      <div className="text-xs text-[var(--muted-foreground)] mt-0.5">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  )
}
