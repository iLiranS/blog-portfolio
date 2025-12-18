'use client'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { useEffect, useState } from 'react';

const navItems = {
  '/': {
    name: 'Home',
  },
  '/project': {
    name: 'Projects'
  },
  '/blog': {
    name: 'Blog',
  },
}

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="-ml-2 mb-16 tracking-tight">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex  flex-row items-center justify-between relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
          id="nav"
        >
          <div className="flex flex-row space-x-0 pr-10">
            {Object.entries(navItems).map(([path, { name }]) => {
              return (
                <Link
                  key={path}
                  href={path}
                  className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2 m-1"
                >
                  {name}
                </Link>
              )
            })}
          </div>
          <div onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} className='grid place-items-center gap-1 border p-1 rounded-md mr-2'>
            {mounted ? (theme === 'light' ? <MdOutlineLightMode /> : <MdOutlineDarkMode />) : null}
          </div>
        </nav>

      </div>

    </header>
  )
}
