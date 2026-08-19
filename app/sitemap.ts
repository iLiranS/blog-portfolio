import { getBlogPosts, getProjectPosts } from 'app/blog/utils'
import type { MetadataRoute } from 'next'

export const baseUrl = 'https://www.lirans.online'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const today = new Date().toISOString().split('T')[0]

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // Blog posts
  const blogPosts: MetadataRoute.Sitemap = getBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.metadata.updatedAt || post.metadata.publishedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // Project posts
  const projectPosts: MetadataRoute.Sitemap = getProjectPosts().map((post) => ({
    url: `${baseUrl}/projects/${post.slug}`,
    lastModified: post.metadata.updatedAt || post.metadata.publishedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...blogPosts, ...projectPosts]
}
