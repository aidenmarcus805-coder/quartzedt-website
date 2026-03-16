export const PRICING_PLAN = {
  price: 79.99,
  priceAnnual: 719,
  originalPrice: 199,
  originalPriceAnnual: 1790,
  features: [
    'Up to 4 weddings/month',
    'AI ingest, culling & sync',
    'Ceremony, reception & highlight sequences',
    'Premiere, Resolve & Final Cut XML',
    'Per-creator style learning',
    'Email support',
  ],
  // Creem product IDs
  creemProductIdMonthly: 'prod_3gDIsxL6bdPrFsNG5v0Mo',
  creemProductIdAnnual: 'prod_annual_placeholder',
};

export const PRICING_PLANS = [
  {
    id: 'solo',
    name: 'Solo',
    price: 79.99,
    priceAnnual: 719,
    tagline: 'For independent wedding filmmakers',
    effectiveCost: '$20 per wedding',
    weddings: 4,
    features: [
      'Up to 4 weddings/month',
      'AI ingest, culling & sync',
      'Ceremony, reception & highlight sequences',
      'Premiere, Resolve & Final Cut XML',
      'Per-creator style learning',
      'Email support',
    ],
    cta: 'Start Free Trial',
    creemProductIdMonthly: 'prod_3gDIsxL6bdPrFsNG5v0Mo',
    creemProductIdAnnual: 'prod_annual_placeholder',
    highlighted: false,
  },
  {
    id: 'studio',
    name: 'Studio',
    price: 199.99,
    priceAnnual: 1799,
    tagline: 'For small studios and multi-shooter teams',
    effectiveCost: '$16.67 per wedding',
    weddings: 12,
    features: [
      'Up to 12 weddings/month',
      'All Solo features',
      'Multiple team seats',
      'Priority processing queue',
      'Batch upload multiple weddings',
      'Phone & email support',
    ],
    cta: 'Start Free Trial',
    creemProductIdMonthly: 'prod_studio_placeholder',
    creemProductIdAnnual: 'prod_studio_annual_placeholder',
    highlighted: true,
  },
];

export const SOCIAL_ADDON = {
  price: 20,
  name: 'Quartz Social',
  tagline: 'Turn your edits into hands-off marketing',
  features: [
    'Unlimited vertical reel generation',
    'AI wedding-specific captions & hashtags',
    'Instagram & TikTok ready exports',
    'Agent-assisted auto-posting (optional)',
  ],
};
