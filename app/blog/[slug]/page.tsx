import { notFound } from "next/navigation"
import MarkdownRenderer from "app/components/markdown"
import { ScrollProgress } from "app/components/scroll-progress"
import { TableOfContents } from "app/components/table-of-contents"
import { formatDate, getBlogPosts, extractHeadings, getReadTime } from "app/blog/utils"
import { baseUrl } from "app/sitemap"
import Link from "next/link"
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react"

interface BlogPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  let posts = getBlogPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPageProps) {
  const { slug } = await params
  const post = getBlogPosts().find((p) => p.slug === slug)
  if (!post) return {}

  const { title, publishedAt: publishedTime, summary: description, image } = post.metadata
  const ogImage = image ? image : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/blog/${post.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
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

export default async function Blog({ params }: BlogPageProps) {
  const { slug } = await params
  const allPosts = getBlogPosts().sort((a, b) => {
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
      <ScrollProgress />
      <div className="relative w-full">
        {/* Schema Markup */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: post.metadata.title,
              datePublished: post.metadata.publishedAt,
              dateModified: post.metadata.publishedAt,
              description: post.metadata.summary,
              image: post.metadata.image
                ? `${baseUrl}${post.metadata.image}`
                : `/og?title=${encodeURIComponent(post.metadata.title)}`,
              url: `${baseUrl}/blog/${post.slug}`,
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
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground font-mono">
              <span className="flex items-center gap-1.5 rounded-full bg-muted/50 border border-border/30 px-3 py-1">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                <time dateTime={post.metadata.publishedAt}>
                  {formatDate(post.metadata.publishedAt)}
                </time>
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-muted/50 border border-border/30 px-3 py-1">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span>{readTime} min read</span>
              </span>
            </div>
          </header>

          {/* Table of Contents - Outside container on desktop */}
          {headings.length > 0 && (
            <aside className="hidden lg:block absolute left-full ml-10 xl:ml-16 top-0 bottom-0 w-48">
              <div className="sticky top-28">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50 mb-3 text-right pr-2">
                  On this page
                </p>
                <TableOfContents headings={headings} />
              </div>
            </aside>
          )}

          {/* Main Prose Content */}
          <div className="w-full">
            <MarkdownRenderer content={post.content} />
          </div>
        </article>

        <hr className="my-8 border-border/40" />

        {/* Navigation Links */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
          {prevPost ? (
            <Link
              href={`/blog/${prevPost.slug}`}
              className="group flex flex-col gap-1.5 p-3 rounded-xl border border-border/40 hover:border-primary/30 bg-card-background hover:bg-muted/30 transition-[transform] duration-300 sm:w-1/2"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary flex items-center gap-1">
                <ArrowLeft className="h-3 w-3" /> Previous Article
              </span>
              <span className="font-semibold text-sm text-foreground group-hover:underline">
                {prevPost.metadata.title}
              </span>
            </Link>
          ) : (
            <div className="hidden sm:block sm:w-1/2" />
          )}

          {nextPost ? (
            <Link
              href={`/blog/${nextPost.slug}`}
              className="group flex flex-col gap-1.5 p-3 rounded-xl border border-border/40 hover:border-primary/30 bg-card-background hover:bg-muted/30 transition-[transform] duration-300 sm:w-1/2 items-end text-right"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary flex items-center gap-1">
                Next Article <ArrowRight className="h-3 w-3" />
              </span>
              <span className="font-semibold text-sm text-foreground group-hover:underline">
                {nextPost.metadata.title}
              </span>
            </Link>
          ) : (
            <div className="hidden sm:block sm:w-1/2" />
          )}
        </div>
      </div>
    </>
  )
}
