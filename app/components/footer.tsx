function ArrowIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
    >
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="mb-16">
      <ul className="font-sm mt-8 flex flex-col space-x-0 space-y-2 text-neutral-600 md:flex-row md:space-x-4 md:space-y-0 dark:text-neutral-300">
        <li>
          <a
            className="group flex items-center hover:text-neutral-800 dark:hover:text-neutral-100 transition-colors duration-300"
            rel="noopener noreferrer"
            target="_blank"
            href="https://www.linkedin.com/in/lirans/"
          >
            <ArrowIcon />
            <span className="relative ml-2 h-7 flex items-center">
              linkedin
              <span className="absolute bottom-1 left-0 w-full h-px bg-neutral-800 dark:bg-neutral-100 transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </span>
          </a>
        </li>
        <li>
          <a
            className="group flex items-center hover:text-neutral-800 dark:hover:text-neutral-100 transition-colors duration-300"
            rel="noopener noreferrer"
            target="_blank"
            href="https://github.com/iLiranS"
          >
            <ArrowIcon />
            <span className="relative ml-2 h-7 flex items-center">
              github
              <span className="absolute bottom-1 left-0 w-full h-px bg-neutral-800 dark:bg-neutral-100 transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </span>
          </a>
        </li>
        <li>
          <a
            className="group flex items-center hover:text-neutral-800 dark:hover:text-neutral-100 transition-colors duration-300"
            rel="noopener noreferrer"
            target="_blank"
            href="mailto:liransdev@gmail.com"
          >
            <ArrowIcon />
            <span className="relative ml-2 h-7 flex items-center">
              contact
              <span className="absolute bottom-1 left-0 w-full h-px bg-neutral-800 dark:bg-neutral-100 transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </span>
          </a>
        </li>
      </ul>
    </footer>
  )
}
