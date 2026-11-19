export type Lang = 'en' | 'hi'

export interface Translations {
  nav: {
    about: string
    stats: string
    packages: string
    quote: string
    aiStudio: string
    match: string
    caseStudies: string
    blog: string
    contact: string
    cta: string
  }
  hero: {
    availability: string
    reachBadge: string
    projectsBadge: string
    tagline: string
    subTagline: string
    skills: string[]
    primaryCta: string
    secondaryCta: string
    follow: string
    followersLabel: string
    viewsLabel: string
    postsLabel: string
    scroll: string
  }
  stats: {
    eyebrow: string
    headingPrefix: string
    headingAccent: string
    subtitle: string
    platformEyebrow: string
    platformHeadingPrefix: string
    platformHeadingAccent: string
    platformSubtitle: string
    visitProfile: string
  }
  packages: {
    eyebrow: string
    headingPrefix: string
    headingAccent: string
    subtitle: string
    allPackages: string
    popular: string
    startingFrom: string
    getQuote: string
    addonsTitle: string
    addonsHint: string
    notSure: string
    discussCta: string
  }
  quoteBuilder: {
    eyebrow: string
    headingPrefix: string
    headingAccent: string
    subtitle: string
    brandPlaceholder: string
    reset: string
    summaryTitle: string
    estimatedReach: string
    blendedCpm: string
    turnaround: string
    subtotal: string
    bundleDiscount: string
    totalEstimate: string
    copyLink: string
    copiedLink: string
    downloadProposal: string
    bookCustomPack: string
    emptyState: string
    discountBanner3: string
    discountBanner5: string
  }
  aiStudio: {
    eyebrow: string
    headingPrefix: string
    headingAccent: string
    subtitle: string
    brandLabel: string
    productLabel: string
    categoryLabel: string
    goalLabel: string
    outputLangLabel: string
    generateBtn: string
    generatingBtn: string
    useInBrief: string
    copyHook: string
    copied: string
  }
  faq: {
    badge: string
    headingPrefix: string
    headingAccent: string
    subtitle: string
    moreQuestion: string
    whatsappCta: string
  }
  contact: {
    eyebrow: string
    headingPrefix: string
    headingAccent: string
    subtitle: string
    totalAudience: string
    repliesWithin: string
  }
  footer: {
    tagline: string
    quickLinks: string
    getInTouch: string
    responseTime: string
    responseValue: string
    location: string
    locationValue: string
    rights: string
    madeInIndia: string
  }
}

export const TRANSLATIONS: Record<Lang, Translations> = {
  en: {
    nav: {
      about: 'About',
      stats: 'Stats',
      packages: 'Packages',
      quote: 'Quote Builder',
      aiStudio: 'AI Hooks',
      match: 'Match',
      caseStudies: 'Case Studies',
      blog: 'Blog',
      contact: 'Contact',
      cta: 'Get in Touch',
    },
    hero: {
      availability: 'Available for Collaborations',
      reachBadge: '850K+ Reach',
      projectsBadge: '200+ Projects',
      tagline: "India's Premier Tech Content Creator",
      subTagline: 'Creating Content That Converts',
      skills: ['Tech Reviews', 'Unboxings', 'Brand Collabs', 'Tutorials', 'Shorts & Reels'],
      primaryCta: "Let's Collab",
      secondaryCta: 'View My Work',
      follow: 'Follow',
      followersLabel: 'Followers',
      viewsLabel: 'Views',
      postsLabel: 'Posts',
      scroll: 'Scroll',
    },
    stats: {
      eyebrow: 'Reach & Impact',
      headingPrefix: 'Numbers That',
      headingAccent: ' Speak',
      subtitle:
        'Real metrics from real campaigns. These numbers represent the impact and reach of content created for brands across platforms.',
      platformEyebrow: 'Platform Breakdown',
      platformHeadingPrefix: 'Performance Across ',
      platformHeadingAccent: 'Channels',
      platformSubtitle: 'Follow us across every platform',
      visitProfile: 'Visit profile',
    },
    packages: {
      eyebrow: 'Collaboration Packages',
      headingPrefix: 'Choose Your',
      headingAccent: ' Perfect Package',
      subtitle:
        'From quick social mentions to full-scale campaigns, find the collaboration type that fits your brand goals and budget.',
      allPackages: 'All Packages',
      popular: 'Popular',
      startingFrom: 'Starting from ',
      getQuote: 'Get Quote',
      addonsTitle: 'Add-On Services',
      addonsHint: 'Click any add-on below to bundle it automatically into your package quote',
      notSure: 'Not sure which package is right for you?',
      discussCta: "Let's Discuss Your Campaign",
    },
    quoteBuilder: {
      eyebrow: 'Custom Campaign Builder',
      headingPrefix: 'Build Your',
      headingAccent: ' Custom Quote',
      subtitle:
        'Mix and match deliverables to get an instant campaign estimate, shareable link, and print-ready proposal.',
      brandPlaceholder: 'Your Brand Name (optional, e.g. Nothing India)',
      reset: 'Reset',
      summaryTitle: 'Live Campaign Proposal',
      estimatedReach: 'Est. Views',
      blendedCpm: 'Blended CPM',
      turnaround: 'Turnaround',
      subtotal: 'Subtotal',
      bundleDiscount: 'Bundle Savings',
      totalEstimate: 'Total Estimate',
      copyLink: 'Copy Shareable Quote Link',
      copiedLink: 'Quote Link Copied!',
      downloadProposal: 'Print / Save Proposal PDF',
      bookCustomPack: 'Book This Custom Pack',
      emptyState: 'Add deliverables on the left to build your custom quote.',
      discountBanner3: '10% Multi-Deliverable Bundle Savings Unlocked!',
      discountBanner5: '15% Full-Campaign Bundle Savings Unlocked!',
    },
    aiStudio: {
      eyebrow: 'AI Campaign Studio',
      headingPrefix: 'Generate',
      headingAccent: ' Viral Tech Hooks',
      subtitle:
        'Tell us your product and campaign goal — get tailored TechVyro-style YouTube & Reel hooks, angles, and package recommendations in seconds.',
      brandLabel: 'Brand Name',
      productLabel: 'Product / App Name',
      categoryLabel: 'Tech Category',
      goalLabel: 'Campaign Goal',
      outputLangLabel: 'Script Style',
      generateBtn: 'Generate Campaign Concepts',
      generatingBtn: 'Crafting TechVyro Hooks...',
      useInBrief: 'Use Concept in Booking Brief',
      copyHook: 'Copy Hook',
      copied: 'Copied!',
    },
    faq: {
      badge: 'FREQUENTLY ASKED',
      headingPrefix: 'Got ',
      headingAccent: 'Questions?',
      subtitle:
        'Everything you wanted to know — clear, straightforward answers. Anything else? Just send us a WhatsApp message.',
      moreQuestion: 'Have another question?',
      whatsappCta: 'Ask on WhatsApp →',
    },
    contact: {
      eyebrow: "Let's Work Together",
      headingPrefix: 'Book a',
      headingAccent: ' Collaboration',
      subtitle:
        "A quick 4-step brief — tell me about your brand and campaign, and I'll personally reply within 24 hours with the perfect plan.",
      totalAudience: 'Total Audience',
      repliesWithin: 'Replies within 24 hours',
    },
    footer: {
      tagline:
        "India's Premier Tech Content Creator. Creating content that informs, engages, and converts for brands across the tech industry.",
      quickLinks: 'Quick Links',
      getInTouch: 'Get In Touch',
      responseTime: 'Response Time',
      responseValue: 'Within 24 hours',
      location: 'Location',
      locationValue: 'India',
      rights: 'All rights reserved.',
      madeInIndia: 'in India',
    },
  },
  hi: {
    nav: {
      about: 'हमारे बारे में',
      stats: 'आँकड़े',
      packages: 'पैकेज',
      quote: 'कोट बिल्डर',
      aiStudio: 'AI हुक्स',
      match: 'ब्रांड मैच',
      caseStudies: 'केस स्टडी',
      blog: 'ब्लॉग',
      contact: 'संपर्क करें',
      cta: 'कॉलैब करें',
    },
    hero: {
      availability: 'ब्रांड कोलैबोरेशन के लिए उपलब्ध',
      reachBadge: '850K+ रीच',
      projectsBadge: '200+ प्रोजेक्ट्स',
      tagline: 'भारत का प्रीमियर टेक कंटेंट क्रिएटर',
      subTagline: 'ऐसा कंटेंट जो व्यूज़ और सेल्स दोनों लाए',
      skills: ['टेक रिव्यू', 'अनबॉक्सिंग', 'ब्रांड कोलैब', 'ट्यूटोरियल्स', 'शॉर्ट्स व रील्स'],
      primaryCta: 'कोलैब शुरू करें',
      secondaryCta: 'हमारा काम देखें',
      follow: 'फॉलो करें',
      followersLabel: 'फॉलोअर्स',
      viewsLabel: 'कुल व्यूज़',
      postsLabel: 'कंटेंट पोस्ट्स',
      scroll: 'नीचे स्क्रॉल करें',
    },
    stats: {
      eyebrow: 'रीच और इम्पैक्ट',
      headingPrefix: 'आँकड़े जो',
      headingAccent: ' खुद बोलते हैं',
      subtitle:
        'असली कैंपेन से असली नतीजे। ये नंबर हमारे सभी सोशल प्लेटफॉर्म्स पर ब्रांड्स के लिए बनाए गए इम्पैक्ट को दिखाते हैं।',
      platformEyebrow: 'प्लेटफॉर्म ब्रेकडाउन',
      platformHeadingPrefix: 'हर चैनल पर ',
      platformHeadingAccent: 'दमदार परफॉर्मेंस',
      platformSubtitle: 'सभी प्लेटफॉर्म्स पर हमसे जुड़ें',
      visitProfile: 'प्रोफ़ाइल देखें',
    },
    packages: {
      eyebrow: 'कोलैबोरेशन पैकेज',
      headingPrefix: 'चुनें अपना',
      headingAccent: ' परफेक्ट पैकेज',
      subtitle:
        'क्विक रील मेंशन से लेकर फुल-स्केल लॉन्च कैंपेन तक — अपने ब्रांड के गोल और बजट के हिसाब से पैकेज चुनें।',
      allPackages: 'सभी पैकेज',
      popular: 'लोकप्रिय',
      startingFrom: 'शुरुआत ',
      getQuote: 'कोट पाएं',
      addonsTitle: 'ऐड-ऑन सेवाएँ',
      addonsHint: 'अपने पैकेज कोट में ऑटोमैटिक जोड़ने के लिए किसी भी ऐड-ऑन पर क्लिक करें',
      notSure: 'समझ नहीं आ रहा कौन-सा पैकेज सही रहेगा?',
      discussCta: 'कैंपेन पर बात करें',
    },
    quoteBuilder: {
      eyebrow: 'कस्टम कैंपेन बिल्डर',
      headingPrefix: 'बनाएँ अपना',
      headingAccent: ' कस्टम कोट',
      subtitle:
        'अपनी पसंद के डिलीवरेबल्स चुनें और तुरंत कैंपेन एस्टिमेट, शेयरेबल लिंक और प्रिंट-रेडी प्रपोज़ल पाएँ।',
      brandPlaceholder: 'आपके ब्रांड का नाम (वैकल्पिक, जैसे Nothing India)',
      reset: 'रीसेट करें',
      summaryTitle: 'लाइव कैंपेन प्रपोज़ल',
      estimatedReach: 'अनुमानित व्यूज़',
      blendedCpm: 'औसत CPM',
      turnaround: 'डिलीवरी समय',
      subtotal: 'सबटोटल',
      bundleDiscount: 'बंडल बचत',
      totalEstimate: 'कुल अनुमान',
      copyLink: 'शेयरेबल कोट लिंक कॉपी करें',
      copiedLink: 'कोट लिंक कॉपी हो गया!',
      downloadProposal: 'प्रपोज़ल PDF प्रिंट / सेव करें',
      bookCustomPack: 'इस कस्टम पैक को बुक करें',
      emptyState: 'कस्टम कोट बनाने के लिए बाईं ओर से डिलीवरेबल्स जोड़ें।',
      discountBanner3: '10% मल्टी-डिलीवरेबल बंडल डिस्काउंट अनलॉक!',
      discountBanner5: '15% फुल-कैंपेन बंडल डिस्काउंट अनलॉक!',
    },
    aiStudio: {
      eyebrow: 'AI कैंपेन स्टूडियो',
      headingPrefix: 'बनाएँ वायरल',
      headingAccent: ' टेक हुक्स (AI)',
      subtitle:
        'अपना प्रोडक्ट और गोल बताएँ — कुछ ही सेकंड में TechVyro स्टाइल YouTube और Reel हुक्स, क्रिएटिव एंगल और पैकेज सुझाव पाएँ।',
      brandLabel: 'ब्रांड का नाम',
      productLabel: 'प्रोडक्ट / ऐप का नाम',
      categoryLabel: 'टेक कैटेगरी',
      goalLabel: 'कैंपेन का लक्ष्य',
      outputLangLabel: 'स्क्रिप्ट भाषा',
      generateBtn: 'AI कैंपेन आइडियाज़ बनाएँ',
      generatingBtn: 'TechVyro हुक्स तैयार हो रहे हैं...',
      useInBrief: 'इस कॉन्सेप्ट को ब्रीफ में जोड़ें',
      copyHook: 'हुक कॉपी करें',
      copied: 'कॉपी हो गया!',
    },
    faq: {
      badge: 'अक्सर पूछे जाने वाले सवाल',
      headingPrefix: 'कोई ',
      headingAccent: 'सवाल है?',
      subtitle:
        'जो भी जानना चाहते हैं — सीधे और साफ जवाब। कुछ और पूछना हो तो सीधे WhatsApp पर मैसेज करें।',
      moreQuestion: 'कोई और सवाल है?',
      whatsappCta: 'WhatsApp पर पूछें →',
    },
    contact: {
      eyebrow: 'साथ मिलकर काम करें',
      headingPrefix: 'बुक करें',
      headingAccent: ' ब्रांड कोलैबोरेशन',
      subtitle:
        'बस 4 आसान स्टेप्स में अपना ब्रीफ भेजें — हम 24 घंटे के अंदर आपके लिए बेस्ट प्लान के साथ रिप्लाई करेंगे।',
      totalAudience: 'कुल ऑडियंस',
      repliesWithin: '24 घंटे के भीतर जवाब',
    },
    footer: {
      tagline:
        'भारत का प्रीमियर टेक कंटेंट क्रिएटर। टेक ब्रांड्स के लिए ऐसा कंटेंट जो जानकारी दे, एंगेज करे और कन्वर्ट करे।',
      quickLinks: 'क्विक लिंक्स',
      getInTouch: 'संपर्क जानकारी',
      responseTime: 'रिप्लाई समय',
      responseValue: '24 घंटे के अंदर',
      location: 'लोकेशन',
      locationValue: 'भारत (India)',
      rights: 'सर्वाधिकार सुरक्षित।',
      madeInIndia: 'भारत में निर्मित',
    },
  },
}
