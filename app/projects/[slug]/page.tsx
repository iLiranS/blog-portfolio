import { notFound } from "next/navigation"
import MarkdownRenderer from "app/components/markdown"
import { TableOfContents, MobileTableOfContents } from "app/components/table-of-contents"
import { formatDate, getProjectPosts, extractHeadings, getReadTime } from "app/blog/utils"
import { baseUrl } from "app/sitemap"
import Link from "next/link"
import { Calendar, Clock, RotateCw } from "lucide-react"
import { PostNavigation } from "app/components/post-navigation"

interface ProjectPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  let posts = getProjectPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params
  const post = getProjectPosts().find((p) => p.slug === slug)
  if (!post) return {}

  const { title, publishedAt: publishedTime, updatedAt, summary: description, image } = post.metadata
  const ogImage = image ? image : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/projects/${post.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      ...(updatedAt ? { modifiedTime: updatedAt } : {}),
      url: `${baseUrl}/projects/${post.slug}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function Projects({ params }: ProjectPageProps) {
  const { slug } = await params
  const allPosts = getProjectPosts().sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return 1
    }
    return -1
  })

  const postIndex = allPosts.findIndex((post) => post.slug === slug)
  if (postIndex === -1) {
    return notFound()
  }

  const post = allPosts[postIndex]
  const prevPost = allPosts[postIndex - 1] || null
  const nextPost = allPosts[postIndex + 1] || null

  const headings = extractHeadings(post.content)
  const readTime = getReadTime(post.content)

  return (
    <>
      <div className="relative">
        {/* Schema Markup */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CreativeWork",
              name: post.metadata.title,
              datePublished: post.metadata.publishedAt,
              dateModified: post.metadata.updatedAt || post.metadata.publishedAt,
              description: post.metadata.summary,
              image: post.metadata.image
                ? `${baseUrl}${post.metadata.image}`
                : `/og?title=${encodeURIComponent(post.metadata.title)}`,
              url: `${baseUrl}/projects/${post.slug}`,
              author: {
                "@type": "Person",
                name: "Liran",
              },
              publisher: {
                "@type": "Organization",
                name: "LiranS",
                logo: {
                  "@type": "ImageObject",
                  url: `${baseUrl}/favicon.ico`,
                },
              },
            }),
          }}
        />

        <article className="w-full">
          {/* Header Area */}
          <header className="mb-8 border-b border-border/40 pb-6 flex flex-col gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl leading-tight">
              {post.metadata.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground font-mono">
              <span className="liquid-glass-pill flex items-center gap-1.5 rounded-full px-3 py-1 text-foreground/85">
                <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                <time dateTime={post.metadata.publishedAt}>
                  {formatDate(post.metadata.publishedAt)}
                </time>
              </span>
              {post.metadata.updatedAt && (
                <span className="liquid-glass-pill flex items-center gap-1.5 rounded-full px-3 py-1 text-foreground/85">
                  <RotateCw className="h-3 w-3 text-primary shrink-0" />
                  <time dateTime={post.metadata.updatedAt}>
                    Updated {formatDate(post.metadata.updatedAt)}
                  </time>
                </span>
              )}
              <span className="liquid-glass-pill flex items-center gap-1.5 rounded-full px-3 py-1 text-foreground/85">
                <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>{readTime} min read</span>
              </span>
            </div>
          </header>

          {/* Table of Contents - Outside container on desktop */}
          {headings.length > 0 && (
            <aside className="hidden min-[1080px]:block absolute left-full ml-2 min-[1200px]:ml-4 xl:ml-6 top-0 bottom-0 w-16 pointer-events-none z-30">
              <div className="sticky top-28">
                <TableOfContents headings={headings} />
              </div>
            </aside>
          )}

          {/* Optional compact Mobile Table of Contents (enabled via `toc: true` in MDX frontmatter) */}
          {post.metadata.toc && headings.length > 0 && (
            <MobileTableOfContents headings={headings} />
          )}

          {/* Main Prose Content */}
          <div className="w-full">
            <MarkdownRenderer content={post.content} />
          </div>
        </article>

        <hr className="my-8 border-border/40" />

        {/* Navigation Links */}
        <PostNavigation
          basePath="/projects"
          label="Project"
          prevPost={prevPost}
          nextPost={nextPost}
        />
      </div>
    </>
  )
}
