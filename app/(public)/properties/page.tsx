import { createClient } from "@/lib/supabase/server"
import { Property, PropertyMedia } from "@/lib/types"
import { PropertyCard } from "@/components/properties/property-card"
import { PropertiesToolbar } from "@/components/properties/properties-toolbar"
import styles from "@/styles/properties.module.css"

export const metadata = {
  title: "Browse Properties | StrongTower Holdings",
  description: "Browse all available houses and land for sale across Nigeria",
}

type SearchParams = {
  type?: string
  state?: string
  sort?: string
  verified?: string
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const supabase = await createClient()
  const params = await searchParams

  let query = supabase
    .from("properties")
    .select(`*, property_media(*)`)
    .eq("status", "active")

  if (params.type) {
    query = query.eq("property_type", params.type)
  }

  if (params.state) {
    query = query.eq("state", params.state)
  }

  const sortBy = params.sort || "newest"
  switch (sortBy) {
    case "price-asc":
      query = query.order("price_min", { ascending: true, nullsFirst: false })
      break
    case "price-desc":
      query = query.order("price_min", { ascending: false, nullsFirst: false })
      break
    case "newest":
    default:
      query = query.order("created_at", { ascending: false })
      break
  }

  const { data: properties, error } = await query

  if (error) {
    console.error("Error fetching properties:", error)
  }

  const typedProperties = properties as
    | (Property & { property_media: PropertyMedia[] })[]
    | null

  const list = typedProperties || []

  const activeType = params.type || "all"
  const displayTitle =
    activeType === "all"
      ? "All properties"
      : activeType === "house"
        ? "Houses"
        : "Land"

  return (
    <div className={styles.page}>
      <PropertiesToolbar
        currentType={params.type}
        currentState={params.state}
        currentSort={params.sort || "newest"}
        verifiedOnly={params.verified === "true"}
      />

      <div className={styles.body}>
        <div className={styles.head}>
          <div>
            <h1 className={styles.title}>{displayTitle}</h1>
            <p className={styles.count}>
              {list.length}{" "}
              {list.length === 1 ? "property" : "properties"} across Nigeria
            </p>
          </div>
        </div>

        {list.length === 0 ? (
          <div className={styles.empty}>
            <h3>No properties match your search</h3>
            <p>Try a different category or clear your filters</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {list.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
