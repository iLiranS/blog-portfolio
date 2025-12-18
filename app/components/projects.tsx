import Link from 'next/link'
import { formatDate, getProjectPosts } from 'app/blog/utils'

const ProjectPosts: React.FC<{ amount?: number }> = ({ amount }) => {
    let allProjects = getProjectPosts().sort((a, b) => {
        if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
        ) {
            return -1
        }
        return 1
    })
    if (amount) allProjects = allProjects.slice(0, amount)

    return (
        <div>
            {allProjects
                .map((post) => (
                    <Link
                        key={post.slug}
                        className="flex flex-col space-y-1 mb-4"
                        href={`/project/${post.slug}`}
                    >
                        <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
                            <p className="text-neutral-600/80 dark:text-neutral-400  tabular-nums pr-2">
                                {formatDate(post.metadata.publishedAt, false)}
                            </p>
                            <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                                {post.metadata.title}
                            </p>
                        </div>
                    </Link>
                ))}
        </div>
    )
}
export default ProjectPosts