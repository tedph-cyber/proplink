import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { PropertyCard } from "@/components/properties/property-card";
import { HomepageSearch } from "@/components/properties/homepage-search";
import { Property, PropertyMedia } from "@/lib/types";

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
      <section className="bg-gradient-to-b from-[var(--muted)] to-[var(--background)] py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--foreground)]">
              Find Your Perfect Property
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-[var(--muted-foreground)] px-4 sm:px-0">
              Browse thousands of houses and land listings across Nigeria. 
              Connect directly with sellers via WhatsApp.
            </p>
            
            <HomepageSearch />
            
            <div className="mt-6 flex items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
              <Link href="/properties">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">Browse All Properties</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {typedProperties && typedProperties.length > 0 && (
        <section className="py-12 sm:py-16 bg-[var(--background)]">
          <div className="container mx-auto px-4">
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-[var(--letter-spacing)]">Featured Properties</h2>
                <p className="mt-2 text-sm sm:text-base text-[var(--muted-foreground)]">Latest listings from verified sellers</p>
              </div>
              <Link href="/properties" className="text-sm font-medium text-[var(--primary)] hover:text-[var(--primary)]/80 transition-colors sm:whitespace-nowrap">
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {typedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12 sm:py-16 md:py-20 bg-[var(--muted)]">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[var(--foreground)]">
              Why Choose PropLink?
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-[var(--muted-foreground)]">
              Simple, fast, and direct property marketplace
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
            <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8 text-center shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow">
              <div className="mx-auto h-12 w-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-[var(--card-foreground)] mb-2 tracking-[var(--letter-spacing)]">Browse Freely</h3>
              <p className="text-sm sm:text-base text-[var(--muted-foreground)]">
                No sign-up required. Browse thousands of properties at your convenience.
              </p>
            </div>

            <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8 text-center shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow">
              <div className="mx-auto h-12 w-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-[var(--card-foreground)] mb-2 tracking-[var(--letter-spacing)]">Direct Contact</h3>
              <p className="text-sm sm:text-base text-[var(--muted-foreground)]">
                Connect directly with sellers via WhatsApp. No middlemen, no delays.
              </p>
            </div>

            <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8 text-center shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow">
              <div className="mx-auto h-12 w-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-[var(--card-foreground)] mb-2 tracking-[var(--letter-spacing)]">Safe & Secure</h3>
              <p className="text-sm sm:text-base text-[var(--muted-foreground)]">
                Verified listings with detailed information and transparent pricing.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/80 py-12 sm:py-16">
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
      </section>
    </div>
  );
}
