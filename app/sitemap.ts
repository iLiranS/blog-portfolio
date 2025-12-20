import { getBlogPosts, getProjectPosts } from 'app/blog/utils'

export const baseUrl = 'https://www.lirans.online'

export default async function sitemap() {
  const today = new Date().toISOString().split('T')[0]

  // Static routes
  const staticRoutes = ['', '/blog', '/projects'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: today,
  }))

  // Blog posts
  const blogPosts = getBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }))

  // Project posts
  const projectPosts = getProjectPosts().map((post) => ({
    url: `${baseUrl}/projects/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }))

  return [...staticRoutes, ...blogPosts, ...projectPosts]
}
