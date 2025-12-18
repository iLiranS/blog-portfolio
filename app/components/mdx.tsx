import Link from 'next/link'
import Image from 'next/image'
import { MDXRemote, MDXRemoteOptions } from 'next-mdx-remote-client/rsc'
import React from 'react'
import { InlineCode, MdxTable, MdxTd, MdxTh, Pre, TableOfContents } from './mdx-component'
import remarkFlexibleToc from "remark-flexible-toc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";



function CustomLink(props) {
  let href = props.href

  if (href.startsWith('/')) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    )
  }

  if (href.startsWith('#')) {
    return <a {...props} />
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />
}

function RoundedImage(props) {
  return <Image alt={props.alt} className="rounded-lg" {...props} />
}



function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters except for -
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
}

function createHeading(level) {
  const Heading = ({ children }) => {
    let slug = slugify(children)
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement('a', {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: 'anchor',
        }),
      ],
      children
    )
  }

  Heading.displayName = `Heading${level}`

  return Heading
}

let components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  code: InlineCode,
  pre: Pre,
  table: MdxTable,
  th: MdxTh,
  td: MdxTd,
  TableOfContents
}
const options: MDXRemoteOptions = {
  mdxOptions: {
    remarkPlugins: [
      remarkMath,
      remarkFlexibleToc,
      remarkGfm,
    ],
    rehypePlugins: [
      rehypeKatex,
      [rehypePrettyCode, {
        theme: 'github-dark',
        defaultLang: {
          block: "tsx",
          inline: "",
        },
      }
      ],
    ]
  },

  parseFrontmatter: true,
  vfileDataIntoScope: "toc",
};

export function CustomMDX(props) {
  return (
    <MDXRemote options={options}
      {...props}
      components={{ ...components, ...(props.components || {}) }}
    />
  )
}
