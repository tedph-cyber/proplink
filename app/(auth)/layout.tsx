// Layout for auth routes (login, register, etc.)
// This is a route group - it organizes files without affecting the URL structure

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 via-blue-50/30 to-purple-50/30 dark:from-zinc-950 dark:via-[#0568fd]/10 dark:to-[#c379df]/10 py-12 px-4 overflow-hidden">
      {/* Floating animated orbs for visual interest */}
      <div className="absolute top-20 left-20 h-64 w-64 rounded-full bg-[#0568fd]/10 dark:bg-[#0568fd]/20 blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 h-64 w-64 rounded-full bg-[#c379df]/10 dark:bg-[#c379df]/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="w-full max-w-md relative z-10">
        {children}
      </div>
    </div>
  )
}
