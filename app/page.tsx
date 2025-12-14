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
      <section className="bg-linear-to-b from-zinc-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-5xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
              Find Your Perfect Property
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-600">
              Browse thousands of houses and land listings across Nigeria. 
              Connect directly with sellers via WhatsApp.
            </p>
            
            <HomepageSearch />
            
            <div className="mt-6 flex items-center justify-center gap-4">
              <Link href="/properties">
                <Button size="lg" variant="outline">Browse All Properties</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {typedProperties && typedProperties.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-zinc-900">Featured Properties</h2>
                <p className="mt-2 text-zinc-600">Latest listings from verified sellers</p>
              </div>
              <Link href="/properties" className="text-sm font-medium text-zinc-900 hover:text-zinc-700">
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

      <section className="py-20 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Why Choose PropLink?
            </h2>
            <p className="mt-4 text-lg text-zinc-600">
              Simple, fast, and direct property marketplace
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-2">Browse Freely</h3>
              <p className="text-zinc-600">
                No sign-up required. Browse thousands of properties at your convenience.
              </p>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-2">Direct Contact</h3>
              <p className="text-zinc-600">
                Connect directly with sellers via WhatsApp. No middlemen, no delays.
              </p>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-2">Safe & Secure</h3>
              <p className="text-zinc-600">
                Verified listings with detailed information and transparent pricing.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-zinc-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to List Your Property?
          </h2>
          <p className="text-zinc-300 mb-8 max-w-2xl mx-auto">
            Join thousands of sellers and reach buyers directly. Create your free account today.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
