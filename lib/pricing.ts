export type Currency = 'INR' | 'USD'

const INR_PER_USD = 84

/**
 * Formats an INR amount into either INR (₹) or an approximate rounded USD ($) string.
 */
export function formatPackagePrice(inrAmount: number | null, currency: Currency, plus = false): string {
  if (inrAmount === null) return 'Revenue Share'
  if (currency === 'INR') {
    return `₹${inrAmount.toLocaleString('en-IN')}${plus ? '+' : ''}`
  }
  const rawUsd = inrAmount / INR_PER_USD
  const roundedUsd = rawUsd >= 100 ? Math.round(rawUsd / 10) * 10 : Math.round(rawUsd / 5) * 5
  return `$${roundedUsd.toLocaleString('en-US')}${plus ? '+' : ''}`
}

/**
 * Builds the combined feature list when optional add-ons are attached to a package.
 */
export function mergePackageAddons(baseFeatures: string[], selectedAddons: string[]): string[] {
  if (selectedAddons.length === 0) return baseFeatures
  const normalized = new Set(baseFeatures.map((f) => f.toLowerCase()))
  const extras = selectedAddons
    .filter((addon) => !normalized.has(addon.toLowerCase()))
    .map((addon) => `Add-on: ${addon}`)
  return [...baseFeatures, ...extras]
}
