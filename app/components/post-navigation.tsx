import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface NavPost {
  slug: string
  metadata: {
    title: string
  }
}

interface PostNavigationProps {
  basePath: "/blog" | "/projects"
  label: "Article" | "Project"
  prevPost: NavPost | null
  nextPost: NavPost | null
}

export function PostNavigation({ basePath, label, prevPost, nextPost }: PostNavigationProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
      {prevPost ? (
        <Link
          href={`${basePath}/${prevPost.slug}`}
          className="group liquid-glass-card relative overflow-hidden flex flex-col gap-1.5 p-4 rounded-2xl hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-300 sm:w-1/2"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/80 dark:via-white/35 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/35 via-transparent to-transparent dark:from-white/[0.08] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
          <span className="relative text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1">
            <ArrowLeft className="h-3 w-3 transition-transform duration-300 group-hover:-translate-x-0.5" />
            Previous {label}
          </span>
          <span className="relative font-semibold text-sm text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-1">
            {prevPost.metadata.title}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block sm:w-1/2" />
      )}

      {nextPost ? (
        <Link
          href={`${basePath}/${nextPost.slug}`}
          className="group liquid-glass-card relative overflow-hidden flex flex-col gap-1.5 p-4 rounded-2xl hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-300 sm:w-1/2 items-end text-right"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/80 dark:via-white/35 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-linear-to-bl from-white/35 via-transparent to-transparent dark:from-white/[0.08] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
          <span className="relative text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1">
            Next {label}
            <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
          <span className="relative font-semibold text-sm text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-1">
            {nextPost.metadata.title}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block sm:w-1/2" />
      )}
    </div>
  )
}
