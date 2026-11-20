import Link from "next/link"
import type { CSSProperties, ReactNode } from "react"
import { formatDate } from "app/blog/utils"

interface ContentCardProps {
  href: string
  title: string
  summary?: string
  publishedAt: string
  image?: string
  index: number
  isFeatured: boolean
  icon: ReactNode
}

export function ContentCard({
  href,
  title,
  summary,
  publishedAt,
  image,
  index,
  isFeatured,
  icon,
}: ContentCardProps) {
  return (
    <Link
      href={href}
      style={{ "--index": index } as CSSProperties}
      className={`group liquid-glass-card relative block rounded-2xl overflow-hidden hover:-translate-y-0.5 active:scale-[0.99] opacity-0 animate-slide-up-fade transition-all duration-300 ${
        isFeatured ? "md:col-span-2" : "md:col-span-1"
      }`}
    >
      {/* Subtle top specular sheen on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/80 dark:via-white/35 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300"
      />

      {/* Soft diagonal glass reflection on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/35 via-transparent to-transparent dark:from-white/[0.08] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />

      <div className={`flex flex-col gap-0 ${isFeatured ? "md:flex-row md:items-stretch" : ""}`}>
        {/* Image / Placeholder */}
        <div
          className={`relative overflow-hidden shrink-0 border-b border-black/5 dark:border-white/10 ${
            isFeatured
              ? "aspect-video md:aspect-auto md:w-5/12 md:border-b-0 md:border-r"
              : "aspect-video w-full"
          }`}
        >
          {image ? (
            <img
              src={image}
              alt={title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center min-h-[160px] md:min-h-full p-6 select-none relative overflow-hidden bg-linear-to-br from-primary/14 via-purple-500/8 to-blue-500/12 dark:from-primary/20 dark:via-purple-500/10 dark:to-blue-500/15">
              {/* Mesh dots */}
              <div
                className="absolute inset-0 opacity-20 dark:opacity-30"
                style={{
                  backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              <div className="absolute inset-0 bg-radial from-primary/20 via-transparent to-transparent opacity-70 pointer-events-none" />
              <div className="liquid-glass-pill relative p-3 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                {icon}
              </div>
              <span className="relative mt-3 text-xs font-semibold tracking-wide text-foreground/75 dark:text-foreground/85 px-4 text-center max-w-[200px] line-clamp-2 leading-relaxed">
                {title}
              </span>
            </div>
          )}
        </div>

        {/* Text content */}
        <div className="flex flex-col justify-between p-5 flex-1 min-w-0">
          <div className="flex flex-col gap-2.5">
            <time className="inline-flex self-start items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-white/60 dark:bg-white/[0.06] text-muted-foreground border border-black/5 dark:border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
              {formatDate(publishedAt, false)}
            </time>
            <h3 className="font-bold text-base text-foreground group-hover:text-primary flex items-center gap-1.5 leading-snug transition-colors duration-200">
              {title}
              <span className="inline-block transition-all duration-300 translate-x-[-4px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 text-primary text-sm">
                →
              </span>
            </h3>
            {summary && (
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {summary}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
