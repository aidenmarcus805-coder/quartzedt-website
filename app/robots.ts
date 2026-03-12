import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://quartzeditor.com'; // Adjust to actual production URL

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/'], // Prevent crawling of API routes and authenticated areas
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
