import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/account/',
          '/orders/',
          '/cart/',
          '/checkout/',
          '/login/',
        ],
      },
    ],
    sitemap: 'https://www.gofabrikos.com/sitemap.xml',
    host:    'https://www.gofabrikos.com',
  }
}
