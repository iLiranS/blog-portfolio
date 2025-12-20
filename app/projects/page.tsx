import Footer from 'app/components/footer'
import ProjectPosts from 'app/components/projects'


export const metadata = {
  title: 'Projects',
  description: 'Check my projects.',
}

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">My Projects</h1>
      <ProjectPosts />
      <Footer />
    </section>
  )
}
