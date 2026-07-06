import Link from "next/link"
import { formatDate, getProjectPosts } from "app/blog/utils"
import { FolderGit2 } from "lucide-react"

interface ProjectPostsProps {
  amount?: number
  featured?: boolean
}

export default function ProjectPosts({ amount, featured }: ProjectPostsProps) {
  let allProjects = getProjectPosts()

  if (featured) {
    const featuredSlugs = ["Annota", "visual-novel", "laser-defense"]
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {allProjects.map((post, index) => {
        const isFeatured = index % 3 === 0
        return (
          <Link
            key={post.slug}
            href={`/projects/${post.slug}`}
            style={{ "--index": index } as any}
            className={`group relative block rounded-2xl border border-border/40 bg-linear-to-br from-card-background to-primary/[0.03] dark:to-primary/[0.06] overflow-hidden hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 active:scale-[0.99] opacity-0 animate-slide-up-fade transition-all duration-300 ${isFeatured ? "md:col-span-2" : "md:col-span-1"
              }`}
          >
            {/* Hover accent line at the bottom */}
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-px w-full bg-linear-to-r from-transparent via-primary to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"
            />

            <div className={`flex flex-col gap-0 ${isFeatured ? "md:flex-row md:items-stretch" : ""}`}>
              {/* Image / Placeholder */}
              <div className={`relative overflow-hidden shrink-0 ${isFeatured ? "aspect-video md:aspect-auto md:w-5/12" : "aspect-video w-full"}`}>
                {post.metadata.image ? (
                  <img
                    src={post.metadata.image}
                    alt={post.metadata.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center min-h-[160px] md:min-h-full p-6 select-none relative overflow-hidden bg-linear-to-br from-primary/15 via-purple-500/8 to-blue-500/12 dark:from-primary/20 dark:via-purple-500/10 dark:to-blue-500/15">
                    {/* Mesh dots */}
                    <div className="absolute inset-0 opacity-20 dark:opacity-30" style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                    <div className="absolute inset-0 bg-radial from-primary/20 via-transparent to-transparent opacity-70 pointer-events-none" />
                    <div className="relative p-3 rounded-2xl bg-white/50 dark:bg-black/25 border border-white/50 dark:border-white/10 shadow-sm backdrop-blur-sm flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                      <FolderGit2 className="w-5 h-5 text-primary" />
                    </div>
                    <span className="relative mt-3 text-xs font-semibold tracking-wide text-foreground/70 dark:text-foreground/80 px-4 text-center max-w-[200px] line-clamp-2 leading-relaxed">
                      {post.metadata.title}
                    </span>
                  </div>
                )}
              </div>

              {/* Text content */}
              <div className="flex flex-col justify-between p-5 flex-1 min-w-0">
                <div className="flex flex-col gap-2.5">
                  <time className="inline-flex self-start items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-muted-foreground/8 text-muted-foreground border border-border/40">
                    {formatDate(post.metadata.publishedAt, false)}
                  </time>
                  <h3 className="font-bold text-base text-foreground group-hover:text-primary flex items-center gap-1.5 leading-snug transition-colors duration-200">
                    {post.metadata.title}
                    <span className="inline-block transition-all duration-300 translate-x-[-4px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 text-primary text-sm">
                      →
                    </span>
                  </h3>
                  {post.metadata.summary && (
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
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