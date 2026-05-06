export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'TechVyro Team',
    alternateName: 'TechVyro',
    url: 'https://techvyro.in',
    image: 'https://techvyro.in/images/techvyro-icon.jpg',
    jobTitle: 'Tech Content Creator',
    description: "India's premier tech content creator specialising in tech reviews, unboxings, and brand collaborations.",
    sameAs: [
      'https://youtube.com/@techvyro',
      'https://instagram.com/techvyro',
      'https://facebook.com/techvyro',
      'https://linkedin.com/in/techvyro',
      'https://twitter.com/techvyro',
    ],
    worksFor: { '@type': 'Organization', name: 'TechVyro' },
    nationality: { '@type': 'Country', name: 'India' },
    knowsAbout: ['Technology', 'Content Creation', 'Brand Marketing', 'Social Media'],
  }
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TechVyro',
    url: 'https://techvyro.in',
    logo: 'https://techvyro.in/images/techvyro-icon.jpg',
    sameAs: [
      'https://youtube.com/@techvyro',
      'https://instagram.com/techvyro',
      'https://facebook.com/techvyro',
      'https://linkedin.com/in/techvyro',
      'https://twitter.com/techvyro',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'techvyro@gmail.com',
      telephone: '+91-63960-94707',
      areaServed: 'IN',
      availableLanguage: ['en', 'hi'],
    },
    founder: { '@type': 'Person', name: 'TechVyro Team' },
    foundingDate: '2020',
    slogan: "India's Premier Tech Content Creator",
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'TechVyro',
    url: 'https://techvyro.in',
    description: "India's Premier Tech Content Creator - Reviews, Unboxings & Brand Collaborations",
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://techvyro.in/?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'TechVyro',
      logo: {
        '@type': 'ImageObject',
        url: 'https://techvyro.in/images/techvyro-icon.jpg',
      },
    },
  }
}
