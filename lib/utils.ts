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
