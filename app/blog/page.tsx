import Footer from 'app/components/footer'
import BlogPosts from 'app/components/posts'

import { baseUrl } from 'app/sitemap'

export const metadata = {
  title: 'Blog | Articles & Insights',
  description:
    'Explore articles and insights on full-stack development, encryption, software architecture, and modern web tech.',
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
  openGraph: {
    title: 'Blog | Articles & Insights - LiranS',
    description:
      'Explore articles and insights on full-stack development, encryption, software architecture, and modern web tech.',
    url: `${baseUrl}/blog`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Articles & Insights - LiranS',
    description:
      'Explore articles and insights on full-stack development, encryption, software architecture, and modern web tech.',
  },
}

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">My Blog</h1>
      <BlogPosts />
      <Footer />
    </section>
  )
}
