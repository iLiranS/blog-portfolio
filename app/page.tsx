import BlogPosts from "app/components/posts"
import Footer from "./components/footer"
import ProjectPosts from "./components/projects"

export default function Page() {
  return (
    <section className="flex flex-col gap-10">
      {/* Intro Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-primary via-[#6366F1] to-[#4169E1] bg-clip-text text-transparent sm:text-4xl animate-text-gradient bg-size-[200%_auto]">
            LiranS
          </h1>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            Available for hire
          </span>
        </div>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
          I'm a <strong className="font-semibold text-foreground">Full-Stack Developer</strong> 🧑‍💻 &amp; <strong className="font-semibold text-foreground">C.S Student</strong> 🎓 who loves experimenting with random projects and fields 🧪
        </p>
      </div>

      {/* Projects Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-border/40 pb-2">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Featured Projects
          </h2>
          <a
            href="/projects"
            className="text-xs font-semibold text-primary hover:underline"
          >
            View all projects &rarr;
          </a>
        </div>
        <ProjectPosts featured={true} />
      </div>

      {/* Blog Posts Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-border/40 pb-2">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Recent Articles
          </h2>
          <a
            href="/blog"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Read all posts &rarr;
          </a>
        </div>
        <BlogPosts amount={4} />
      </div>

      <Footer />
    </section>
  )
}
