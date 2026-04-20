export interface SelectedPackage {
  name: string
  description: string
  features: string[]
  category?: string
}

export const PACKAGE_SELECTED_EVENT = 'techvyro:package-selected'

export function mapPackageToCollabType(name: string): string {
  const n = name.toLowerCase()
  if (n.includes('bundle') || n.includes('mega') || n.includes('campaign')) return 'Bundle Package'
  if (n.includes('dedicated') && n.includes('video')) return 'Dedicated Video'
  if (n.includes('integrated')) return 'Integrated Sponsorship'
  if (n.includes('review')) return 'Product Review'
  if (n.includes('reel')) return 'Instagram Reel'
  if (n.includes('short')) return 'YouTube Short'
  if (n.includes('live') || n.includes('stream')) return 'Live Stream'
  if (n.includes('ambassador')) return 'Brand Ambassador'
  if (n.includes('post') || n.includes('story') || n.includes('thread') || n.includes('tiktok')) return 'Social Media Post'
  return 'Other'
}

export function selectPackage(pkg: SelectedPackage) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent<SelectedPackage>(PACKAGE_SELECTED_EVENT, { detail: pkg }))
  // Defer scroll slightly so the contact section receives the event before scrolling
  requestAnimationFrame(() => {
    const el = document.getElementById('contact')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  })
}
