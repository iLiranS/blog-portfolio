import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { formatDate, getBlogPosts } from 'app/blog/utils'
import { baseUrl } from 'app/sitemap'
import Link from 'next/link'

export async function generateStaticParams() {
  let posts = getBlogPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}


export async function generateMetadata({ params }) {
  // params is a Promise in the App Router; await it
  const { slug } = await params

  const post = getBlogPosts().find((p) => p.slug === slug)
  if (!post) return {}

  const { title, publishedAt: publishedTime, summary: description, image } =
    post.metadata

  const ogImage = image ? image : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}


export default async function Blog({ params }) {
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
  // previous and next links
  const prevPost = allPosts[postIndex - 1] || null
  const nextPost = allPosts[postIndex + 1] || null


  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
              '@type': 'Person',
              name: 'Liran',
            },
          }),
        }}
      />
      <h1 className="title font-semibold text-2xl tracking-tighter">
        {post.metadata.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {formatDate(post.metadata.publishedAt)}
        </p>
      </div>
      <article className="prose ">
        <CustomMDX source={post.content} />
      </article>
      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

      <div className="flex justify-between gap-4">
        {prevPost ? (
          <Link
            href={`/blog/${prevPost.slug}`}
            className="group flex flex-col gap-1 text-left sm:w-1/2"
          >
            <span className="text-xs text-neutral-500 uppercase tracking-wider group-hover:text-neutral-700 dark:group-hover:text-neutral-300">
              ← Previous
            </span>
            <span className="font-medium text-neutral-900 dark:text-neutral-100 group-hover:underline">
              {prevPost.metadata.title}
            </span>
          </Link>
        ) : (
          <div className="sm:w-1/2" /> /* Spacer if no prev */
        )}

        {nextPost && (
          <Link
            href={`/blog/${nextPost.slug}`}
            className="group flex flex-col gap-1 text-right sm:w-1/2 items-end"
          >
            <span className="text-xs text-neutral-500 uppercase tracking-wider group-hover:text-neutral-700 dark:group-hover:text-neutral-300">
              Next →
            </span>
            <span className="font-medium text-neutral-900 dark:text-neutral-100 group-hover:underline">
              {nextPost.metadata.title}
            </span>
          </Link>
        )}
      </div>
    </section>

  )
}
