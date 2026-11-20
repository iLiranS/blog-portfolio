import { getBlogPosts } from "app/blog/utils"
import { ContentCard } from "app/components/content-card"
import { BookOpen } from "lucide-react"

interface BlogPostsProps {
  amount?: number
}

export default function BlogPosts({ amount }: BlogPostsProps) {
  let allBlogs = getBlogPosts().sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1
    }
    return 1
  })

  if (amount) {
    allBlogs = allBlogs.slice(0, amount)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {allBlogs.map((post, index) => (
        <ContentCard
          key={post.slug}
          href={`/blog/${post.slug}`}
          title={post.metadata.title}
          summary={post.metadata.summary}
          publishedAt={post.metadata.publishedAt}
          image={post.metadata.image}
          index={index}
          isFeatured={index % 3 === 0}
          icon={<BookOpen className="w-5 h-5 text-primary" />}
        />
      ))}
    </div>
  )
}
