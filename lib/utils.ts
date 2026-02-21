/**
 * Utility functions and helpers
 */

/**
 * Format price for display
 */
export function formatPrice(price: number, currency: string = '₦'): string {
  return `${currency}${price.toLocaleString()}`
}

/**
 * Format price range for display
 */
export function formatPriceRange(
  minPrice: number,
  maxPrice?: number | null,
  currency: string = '₦'
): string {
  if (!maxPrice || minPrice === maxPrice) {
    return formatPrice(minPrice, currency)
  }
  return `${formatPrice(minPrice, currency)} - ${formatPrice(maxPrice, currency)}`
}

/**
 * Generate WhatsApp message link
 */
export function generateWhatsAppLink(
  phoneNumber: string,
  propertyTitle: string,
  propertyId: string
): string {
  // Remove any non-digit characters from phone number
  const cleanNumber = phoneNumber.replace(/\D/g, '')
  
  const message = encodeURIComponent(
    `Hi, I'm interested in your property: ${propertyTitle} (ID: ${propertyId})`
  )
  
  return `https://wa.me/${cleanNumber}?text=${message}`
}

/**
 * Format location for display
 */
export function formatLocation(
  city: string,
  state: string,
  country?: string
): string {
  if (country) {
    return `${city}, ${state}, ${country}`
  }
  return `${city}, ${state}`
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

/**
 * Check if user has admin role
 */
export function isAdmin(role?: string): boolean {
  return role === 'admin'
}

/**
 * Check if user has seller role
 */
export function isSeller(role?: string): boolean {
  return role === 'seller'
}
/**
 * Get LGAs for a given state from mapping
 */
export function getLGAsByState(state: string): string[] {
  const { STATE_LGA_MAPPING_SIMPLIFIED } = require('./constants')
  return STATE_LGA_MAPPING_SIMPLIFIED[state] || []
}

/**
 * Get display label for house type
 */
export function getHouseTypeLabel(houseType: string): string {
  const { HOUSE_TYPES } = require('./constants')
  const type = HOUSE_TYPES.find((t: any) => t.value === houseType)
  return type ? type.label : houseType
}

/**
 * Get display labels for multiple house types
 */
export function getHouseTypeLabels(houseTypes: string[]): string[] {
  return houseTypes.map(getHouseTypeLabel)
}

/**
 * Get display label for bedroom category
 */
export function getBedroomLabel(bedroomCategory: string): string {
  const { BEDROOM_CATEGORIES } = require('./constants')
  const category = BEDROOM_CATEGORIES.find((c: any) => c.value === bedroomCategory)
  return category ? category.label : bedroomCategory
}

/**
 * Get land size unit label and abbreviation
 */
export function getLandSizeUnitDisplay(unit: string): { label: string; abbreviation: string } {
  const { LAND_SIZE_UNITS } = require('./constants')
  const sizeUnit = LAND_SIZE_UNITS.find((u: any) => u.value === unit)
  return sizeUnit ? { label: sizeUnit.label, abbreviation: sizeUnit.abbreviation } : { label: unit, abbreviation: unit }
}

/**
 * Format land size for display
 */
export function formatLandSize(size: number | undefined, unit: string | undefined): string {
  if (!size || !unit) return ''
  const unitDisplay = getLandSizeUnitDisplay(unit)
  return `${size.toLocaleString()} ${unitDisplay.abbreviation}`
}