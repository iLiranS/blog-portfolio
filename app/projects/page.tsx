import Footer from 'app/components/footer'
import ProjectPosts from 'app/components/projects'


import { baseUrl } from 'app/sitemap'

export const metadata = {
  title: 'Projects | Featured Works & Software',
  description:
    'Discover featured open-source software, applications, engines, and web tools built by Liran.',
  alternates: {
    canonical: `${baseUrl}/projects`,
  },
  openGraph: {
    title: 'Projects | Featured Works & Software - LiranS',
    description:
      'Discover featured open-source software, applications, engines, and web tools built by Liran.',
    url: `${baseUrl}/projects`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects | Featured Works & Software - LiranS',
    description:
      'Discover featured open-source software, applications, engines, and web tools built by Liran.',
  },
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
