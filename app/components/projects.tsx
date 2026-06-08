import Link from "next/link"
import { formatDate, getProjectPosts } from "app/blog/utils"

interface ProjectPostsProps {
  amount?: number
  featured?: boolean
}

export default function ProjectPosts({ amount, featured }: ProjectPostsProps) {
  let allProjects = getProjectPosts()

  if (featured) {
    const featuredSlugs = ["Annota", "laser-defense", "portfolio"]
    allProjects = featuredSlugs
      .map((slug) => allProjects.find((p) => p.slug.toLowerCase() === slug.toLowerCase()))
      .filter((p): p is NonNullable<typeof p> => p !== undefined)
  } else {
    allProjects.sort((a, b) => {
      if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
        return -1
      }
      return 1
    })

    if (amount) {
      allProjects = allProjects.slice(0, amount)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {allProjects.map((post, index) => {
        const isFeatured = index % 3 === 0
        return (
          <Link
            key={post.slug}
            href={`/projects/${post.slug}`}
            style={{ "--index": index } as any}
            className={`group block p-5 rounded-2xl border border-border/50 bg-card-background hover:bg-card-background hover:border-primary/30 hover:-translate-y-1 hover:shadow-md hover:shadow-primary/5  active:scale-[0.99] opacity-0 animate-slide-up-fade ${isFeatured ? "md:col-span-2" : "md:col-span-1"
              }`}
          >
            <div className={`flex flex-col gap-5 ${isFeatured ? "md:flex-row md:items-stretch" : ""}`}>
              <div className={`relative overflow-hidden rounded-xl border border-border/30 bg-muted shrink-0 ${isFeatured ? "aspect-video md:aspect-auto md:w-1/2" : "aspect-video w-full"
                }`}>
                {post.metadata.image ? (
                  <img
                    src={post.metadata.image}
                    alt={post.metadata.title}
                    className="object-cover w-full h-full group-hover:scale-103 transition-transform duration-500 ease-out"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-primary/10 via-purple-500/5 to-blue-500/10 flex items-center justify-center min-h-[140px] md:min-h-full">
                    <span className="text-xs font-bold tracking-tight bg-linear-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent opacity-70 px-4 text-center">
                      {post.metadata.title}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
                <div className="flex flex-col gap-2">
                  <time className="text-xs text-muted-foreground font-mono">
                    {formatDate(post.metadata.publishedAt, false)}
                  </time>
                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary   flex items-center gap-1.5 leading-snug">
                    {post.metadata.title}
                    <span className="inline-block transition-all duration-300 translate-x-[-4px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 text-primary">
                      &rarr;
                    </span>
                  </h3>
                  {post.metadata.summary && (
                    <p className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">
                      {post.metadata.summary}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}