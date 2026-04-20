export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Akansh Chahal',
    alternateName: 'TechVyro',
    url: 'https://techvyro.com',
    image: 'https://techvyro.com/images/techvyro-icon.jpg',
    jobTitle: 'Tech Content Creator',
    description: "India's premier tech content creator specialising in tech reviews, unboxings, and brand collaborations.",
    sameAs: [
      'https://youtube.com/@techvyro',
      'https://instagram.com/techvyro',
      'https://facebook.com/techvyro',
    ],
    worksFor: { '@type': 'Organization', name: 'TechVyro' },
    nationality: { '@type': 'Country', name: 'India' },
  }
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TechVyro',
    url: 'https://techvyro.com',
    logo: 'https://techvyro.com/images/techvyro-icon.jpg',
    sameAs: [
      'https://youtube.com/@techvyro',
      'https://instagram.com/techvyro',
      'https://facebook.com/techvyro',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'techvyro@gmail.com',
      telephone: '+91-63960-94707',
      areaServed: 'IN',
      availableLanguage: ['en', 'hi'],
    },
    founder: { '@type': 'Person', name: 'Akansh Chahal' },
    foundingDate: '2020',
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'TechVyro',
    url: 'https://techvyro.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://techvyro.com/?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }
}
