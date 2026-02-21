import { createClient } from "@/lib/supabase/server";
import { PropertyGrid } from "@/components/properties/property-grid";
import { PropertySearch } from "@/components/properties/property-search";
import { Property, PropertyMedia } from "@/lib/types";

export const metadata = {
  title: "Browse Properties | PropLink",
  description: "Browse all available houses and land for sale across Nigeria",
};

type SearchParams = {
  q?: string;
  type?: string;
  state?: string;
  lga?: string;
  city?: string;
  minPrice?: string;
  maxPrice?: string;
  houseTypes?: string;
  bedroom?: string;
  landUnit?: string;
  sort?: string;
};

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const supabase = await createClient();
  
  // Await searchParams in Next.js 16+
  const params = await searchParams;

  // Build query based on search params
  let query = supabase
    .from("properties")
    .select(
      `
      *,
      property_media (*)
    `
    )
    .eq("status", "active"); // Only show active properties

  // Text search across title, description, and location fields
  if (params.q) {
    const searchTerm = params.q.toLowerCase();
    query = query.or(
      `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,state.ilike.%${searchTerm}%,lga.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%`
    );
  }

  // Filter by property type
  if (params.type) {
    query = query.eq("property_type", params.type);
  }

  // Filter by state
  if (params.state) {
    query = query.eq("state", params.state);
  }

  // Filter by LGA
  if (params.lga) {
    query = query.ilike("lga", `%${params.lga}%`);
  }

  // Filter by city
  if (params.city) {
    query = query.ilike("city", `%${params.city}%`);
  }

  // Filter by house types (multi-select checkbox values)
  if (params.houseTypes) {
    const houseTypesArray = params.houseTypes.split(',');
    // Filter properties where features.house_types contains any of the selected types
    const houseTypeFilters = houseTypesArray.map(type => `features->house_types.cs.["${type}"]`);
    query = query.or(houseTypeFilters.join(','));
  }

  // Filter by bedroom category
  if (params.bedroom) {
    query = query.eq('features->>>bedroom_category', params.bedroom);
  }

  // Filter by land size unit
  if (params.landUnit) {
    query = query.eq('features->>>land_size_unit', params.landUnit);
  }

  // Filter by price range
  if (params.minPrice) {
    const minPrice = parseInt(params.minPrice);
    query = query.gte("price_min", minPrice);
  }

  if (params.maxPrice) {
    const maxPrice = parseInt(params.maxPrice);
    query = query.lte("price_max", maxPrice);
  }

  // Sorting
  const sortBy = params.sort || "newest";
  switch (sortBy) {
    case "oldest":
      query = query.order("created_at", { ascending: true });
      break;
    case "price-asc":
      query = query.order("price_min", { ascending: true, nullsFirst: false });
      break;
    case "price-desc":
      query = query.order("price_max", { ascending: false, nullsFirst: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  const { data: properties, error } = await query;

  if (error) {
    console.error("Error fetching properties:", error);
  }

  const typedProperties = properties as
    | (Property & { property_media: PropertyMedia[] })[]
    | null;

  const hasFilters =
    params.q ||
    params.type ||
    params.state ||
    params.lga ||
    params.city ||
    params.minPrice ||
    params.maxPrice;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 sm:text-4xl">
          Browse Properties
        </h1>
        <p className="mt-2 text-zinc-600">
          {typedProperties?.length || 0} {hasFilters ? "matching" : ""}{" "}
          properties {hasFilters ? "found" : "available"}
        </p>
      </div>

      <div className="mb-8">
        <PropertySearch />
      </div>

      {typedProperties && typedProperties.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-semibold text-zinc-900">
            No properties found
          </h3>
          <p className="mt-2 text-zinc-600">
            {hasFilters
              ? "Try adjusting your search filters to find what you're looking for."
              : "No properties are currently available."}
          </p>
        </div>
      ) : (
        <PropertyGrid properties={typedProperties || []} />
      )}
    </div>
  );
}
