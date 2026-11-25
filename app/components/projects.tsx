import { getProjectPosts } from "app/blog/utils"
import { ContentCard } from "app/components/content-card"
import { FolderGit2 } from "lucide-react"

interface ProjectPostsProps {
  amount?: number
  featured?: boolean
}

export default function ProjectPosts({ amount, featured }: ProjectPostsProps) {
  let allProjects = getProjectPosts()

  if (featured) {
    const featuredSlugs = ["Annota", "godot-action-combat", "aurelia"]
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
      {allProjects.map((post, index) => (
        <ContentCard
          key={post.slug}
          href={`/projects/${post.slug}`}
          title={post.metadata.title}
          summary={post.metadata.summary}
          publishedAt={post.metadata.publishedAt}
          image={post.metadata.image}
          index={index}
          isFeatured={index % 3 === 0}
          icon={<FolderGit2 className="w-5 h-5 text-primary" />}
        />
      ))}
    </div>
  )
}
