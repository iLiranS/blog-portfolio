import BlogPosts from 'app/components/posts'
import Footer from './components/footer'


export default function Page() {
  return (
    <>
      <section>
        <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
          LiranS
        </h1>
        <p className="mb-2">
          {`I'm a Full-Stack Web developer 🧑‍💻 and C.S Student 🎓`}
        </p>
        <p>{` I like building cool stuff 🚀`}</p>
        <div className="my-8">
          <h2 className='text-xl my-2'>Recent posts</h2>
          <BlogPosts amount={4} />
        </div>
        <div className="my-8">
          <h2 className='text-xl my-2'>Recent Projects</h2>
          <p className='text-gray-400'>{`Work In Progress...`}</p>
          <p className='text-gray-400'>{`You can see most of them in my github profile for now 🫠`}</p>
        </div>
        <Footer />
      </section>
    </>
  )
}
