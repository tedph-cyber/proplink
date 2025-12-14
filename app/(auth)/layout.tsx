// Layout for auth routes (login, register, etc.)
// This is a route group - it organizes files without affecting the URL structure

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 py-12 px-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
