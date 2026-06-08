"use client"

import React, { useMemo, useState, useRef, type ReactNode, isValidElement } from "react"
import ReactMarkdown from "react-markdown"
import type { Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeRaw from "rehype-raw"
import rehypeKatex from "rehype-katex"
import rehypeHighlight from "rehype-highlight"
import rehypeSanitize, { defaultSchema } from "rehype-sanitize"
import { Copy, Check } from "lucide-react"
import dynamic from "next/dynamic"

const Mermaid = dynamic(() => import("./mermaid").then((m) => m.Mermaid), {
  ssr: false,
})

interface MarkdownRendererProps {
  content: string
}

const markdownSanitizeSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    "details", "summary", "span", "mark", "u", "div",
  ],
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code ?? []), ["className", /^language-./, "math-inline", "math-display"]],
    details: ["open"],
    span: [...(defaultSchema.attributes?.span ?? []), "style", "className"],
    div: ["style", "className"],
    mark: [...(defaultSchema.attributes?.mark ?? []), "style"],
  },
}

export function getChildrenText(children: ReactNode): string {
  if (typeof children === "string") return children
  if (typeof children === "number") return String(children)
  if (Array.isArray(children)) return children.map(getChildrenText).join("")
  if (isValidElement<{ children?: ReactNode }>(children)) {
    return getChildrenText(children.props.children)
  }
  return ""
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function PreWithCopy({ children, ...props }: any) {
  const [isCopied, setIsCopied] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)

  const copyToClipboard = async () => {
    if (!preRef.current) return
    const text = preRef.current.textContent || ""
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy!", err)
    }
  }

  const isMermaid = React.Children.toArray(children).some(
    (child) =>
      React.isValidElement(child) &&
      /language-mermaid/.test((child.props as any)?.className || "")
  )

  if (isMermaid) {
    return <>{children}</>
  }

  return (
    <div className="relative group">
      <button
        onClick={copyToClipboard}
        className="absolute right-3 top-3 z-10 p-1.5 rounded-md bg-background/80 hover:bg-background border border-border/50 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-200 cursor-pointer shadow-sm"
        aria-label="Copy to clipboard"
      >
        {isCopied ? (
          <Check className="h-4 w-4 text-emerald-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
      <pre ref={preRef} {...props}>
        {children}
      </pre>
    </div>
  )
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const markdownComponents: Components = {
    h2: ({ node, children, ...props }: any) => {
      const text = getChildrenText(children)
      const id = slugify(text)
      if (!id) return <h2 {...props}>{children}</h2>
      return (
        <h2 id={id} className="group relative animate-fade-in" {...props}>
          <a
            href={`#${id}`}
            className="absolute -left-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-muted-foreground/60 transition-opacity pr-2 font-normal text-base select-none no-underline"
            aria-hidden
          >
            #
          </a>
          {children}
        </h2>
      )
    },
    h3: ({ node, children, ...props }: any) => {
      const text = getChildrenText(children)
      const id = slugify(text)
      if (!id) return <h3 {...props}>{children}</h3>
      return (
        <h3 id={id} className="group relative animate-fade-in" {...props}>
          <a
            href={`#${id}`}
            className="absolute -left-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-muted-foreground/60 transition-opacity pr-2 font-normal text-base select-none no-underline"
            aria-hidden
          >
            #
          </a>
          {children}
        </h3>
      )
    },
    h4: ({ node, children, ...props }: any) => {
      const text = getChildrenText(children)
      const id = slugify(text)
      if (!id) return <h4 {...props}>{children}</h4>
      return (
        <h4 id={id} className="group relative animate-fade-in" {...props}>
          <a
            href={`#${id}`}
            className="absolute -left-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-muted-foreground/60 transition-opacity pr-2 font-normal text-base select-none no-underline"
            aria-hidden
          >
            #
          </a>
          {children}
        </h4>
      )
    },
    pre: PreWithCopy,
    code: ({ node, className, children, ...props }: any) => {
      const match = /language-mermaid/.exec(className || "")
      if (match) {
        return <Mermaid chart={String(children).replace(/\n$/, "")} />
      }
      return <code className={className} {...props}>{children}</code>
    },
    a: ({ node, children, href, ...props }: any) => {
      const isExternal = href && !href.startsWith("/") && !href.startsWith("#")
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          {...props}
        >
          {children}
        </a>
      )
    },
  }

  return (
    <div className="prose prose-neutral max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          rehypeRaw,
          [rehypeSanitize, markdownSanitizeSchema],
          [rehypeKatex, { output: "html" }],
          [rehypeHighlight, { detect: true }],
        ]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

