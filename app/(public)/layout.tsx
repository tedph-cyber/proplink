// Layout for public routes
// This is a route group - it organizes files without affecting the URL structure

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
