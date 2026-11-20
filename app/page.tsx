import BlogPosts from "app/components/posts"
import ProjectPosts from "./components/projects"

export default function Page() {
  return (
    <section className="flex flex-col gap-12">
      {/* Intro Header */}
      <div className="relative flex flex-col gap-5">
        {/* Subtle ambient glow orb */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 -left-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl dark:bg-primary/8"
        />

        <div className="relative flex flex-col gap-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-primary via-[#6366F1] to-[#4169E1] bg-clip-text text-transparent sm:text-4xl animate-text-gradient bg-size-[200%_auto]">
              LiranS
            </h1>
            {/* Liquid Glass badge with pulsing status dot and specular shimmer */}
            <span className="liquid-glass-pill relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-primary backdrop-blur-md overflow-hidden select-none shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_4px_16px_-4px_color-mix(in_oklab,var(--primary)_25%,transparent)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22),0_4px_20px_-4px_color-mix(in_oklab,var(--primary)_30%,transparent)]">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-linear-to-r from-transparent via-white/50 dark:via-white/20 to-transparent animate-glass-shimmer"
              />
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary shadow-[0_0_8px_var(--primary)]" />
              </span>
              <span className="relative">Available for hire</span>
            </span>
          </div>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
            I&apos;m a <strong className="font-semibold text-foreground">Full-Stack Developer</strong> 🧑‍💻 who loves
            experimenting{" "}
            <span
              className="relative inline-flex items-center justify-center align-baseline select-none pr-2"
              aria-hidden="true"
            >
              <span className="animate-beaker-pour">🧪</span>
              <span className="animate-spill-drop-1 pointer-events-none absolute top-1/2 right-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.75)]" />
              <span className="animate-spill-drop-2 pointer-events-none absolute top-1/2 right-0.5 h-1 w-1 rounded-full bg-emerald-300 shadow-[0_0_5px_rgba(110,231,183,0.75)]" />
              <span className="animate-spill-puddle pointer-events-none absolute -bottom-0.5 -right-0.5 h-0.5 w-2.5 rounded-full bg-emerald-400/80 blur-[0.5px]" />
            </span>
          </p>
        </div>
      </div>

      {/* Projects Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2.5">
            <span className="h-4 w-0.5 rounded-full bg-primary" aria-hidden="true" />
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Featured Projects
            </h2>
          </div>
          <a
            href="/projects"
            className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors duration-150"
          >
            View all &rarr;
          </a>
        </div>
        <ProjectPosts featured={true} />
      </div>

      {/* Blog Posts Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2.5">
            <span className="h-4 w-0.5 rounded-full bg-primary" aria-hidden="true" />
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Recent Articles
            </h2>
          </div>
          <a
            href="/blog"
            className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors duration-150"
          >
            Read all &rarr;
          </a>
        </div>
        <BlogPosts amount={4} />
      </div>
    </section>
  )
}
