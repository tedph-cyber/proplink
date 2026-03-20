import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { PropertyCard } from "@/components/properties/property-card";
import HeroGlass from "@/components/ui/hero-glass";
import { Property, PropertyMedia } from "@/lib/types";
import { SectionReveal, StaggerReveal, StaggerItem } from "@/components/ui/motion-wrappers";

export default async function Home() {
  const supabase = await createClient()

  const { data: featuredProperties } = await supabase
    .from('properties')
    .select(`
      *,
      property_media (*)
    `)
    .order('created_at', { ascending: false })
    .limit(6)

  const typedProperties = featuredProperties as (Property & { property_media: PropertyMedia[] })[] | null

  return (
    <div className="flex flex-col">
      <HeroGlass />

      {typedProperties && typedProperties.length > 0 && (
        <section className="py-12 sm:py-16 bg-[var(--background)]">
          <div className="container mx-auto px-4">
            <SectionReveal className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-[var(--letter-spacing)]">Featured Properties</h2>
                <p className="mt-2 text-sm sm:text-base text-[var(--muted-foreground)]">Latest listings from verified sellers</p>
              </div>
              <Link href="/properties" className="text-sm font-medium text-[var(--primary)] hover:text-[var(--primary)]/80 transition-colors sm:whitespace-nowrap">
                View all →
              </Link>
            </SectionReveal>

            <StaggerReveal className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {typedProperties.map((property) => (
                <StaggerItem key={property.id}>
                  <PropertyCard property={property} />
                </StaggerItem>
              ))}
            </StaggerReveal>
          </div>
        </section>
      )}

      <section className="py-12 sm:py-16 md:py-20 bg-[var(--muted)]">
        <div className="container mx-auto px-4">
          <SectionReveal className="mx-auto max-w-2xl text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[var(--foreground)]">
              Why Choose PropLink?
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-[var(--muted-foreground)]">
              Simple, fast, and direct property marketplace
            </p>
          </SectionReveal>

          <StaggerReveal className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
            {[
              {
                icon: (
                  <svg className="h-6 w-6 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                ),
                title: "Browse Freely",
                desc: "No sign-up required. Browse thousands of properties at your convenience.",
              },
              {
                icon: (
                  <svg className="h-6 w-6 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                ),
                title: "Direct Contact",
                desc: "Connect directly with sellers via WhatsApp. No middlemen, no delays.",
              },
              {
                icon: (
                  <svg className="h-6 w-6 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: "Safe & Secure",
                desc: "Verified listings with detailed information and transparent pricing.",
              },
            ].map(({ icon, title, desc }) => (
              <StaggerItem key={title}>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8 text-center shadow-sm hover:shadow-md transition-shadow h-full">
                  <div className="mx-auto h-12 w-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mb-4">
                    {icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-[var(--card-foreground)] mb-2">{title}</h3>
                  <p className="text-sm sm:text-base text-[var(--muted-foreground)]">{desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      <SectionReveal className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/80 py-12 sm:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 tracking-[var(--letter-spacing)] px-4 sm:px-0">
            Ready to List Your Property?
          </h2>
          <p className="text-sm sm:text-base text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-4 sm:px-0">
            Join thousands of sellers and reach buyers directly. Create your free account today.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto max-w-xs">
              Get Started Now
            </Button>
          </Link>
        </div>
      </SectionReveal>
    </div>
  );
}
