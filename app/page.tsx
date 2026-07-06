import BlogPosts from "app/components/posts"
import Footer from "./components/footer"
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
            {/* Badge with pulsing status dot */}
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
              </span>
              Available for hire
            </span>
          </div>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
            I'm a <strong className="font-semibold text-foreground">Full-Stack Developer</strong> 🧑‍💻 who loves
            experimenting 🧪
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

      <Footer />
    </section>
  )
}
