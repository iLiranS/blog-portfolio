import fs from "fs"
import path from "path"

type Metadata = {
  title: string
  publishedAt: string
  summary: string
  image?: string
}

function parseFrontmatter(fileContent: string) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  let match = frontmatterRegex.exec(fileContent)
  let frontMatterBlock = match![1]
  let content = fileContent.replace(frontmatterRegex, "").trim()
  let frontMatterLines = frontMatterBlock.trim().split("\n")
  let metadata: Partial<Metadata> = {}

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(": ")
    let value = valueArr.join(": ").trim()
    value = value.replace(/^['"](.*)['"]$/, "$1") // Remove quotes
    metadata[key.trim() as keyof Metadata] = value
  })

  // Extract first markdown image as preview if not present in frontmatter
  if (!metadata.image) {
    let imgRegex = /!\[.*?\]\((.*?)\)/
    let imgMatch = imgRegex.exec(content)
    if (imgMatch) {
      metadata.image = imgMatch[1]
    }
  }

  return { metadata: metadata as Metadata, content }
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx")
}

function readMDXFile(filePath: string) {
  let rawContent = fs.readFileSync(filePath, "utf-8")
  return parseFrontmatter(rawContent)
}

function getMDXData(dir: string) {
  let mdxFiles = getMDXFiles(dir)
  return mdxFiles.map((file) => {
    let { metadata, content } = readMDXFile(path.join(dir, file))
    let slug = path.basename(file, path.extname(file))

    return {
      metadata,
      slug,
      content,
    }
  })
}

export function getBlogPosts() {
  return getMDXData(path.join(process.cwd(), "app", "blog", "posts"))
}

export function getProjectPosts() {
  return getMDXData(path.join(process.cwd(), "app", "projects", "posts"))
}

export function formatDate(date: string, includeRelative = false) {
  let currentDate = new Date()
  if (!date.includes("T")) {
    date = `${date}T00:00:00`
  }
  let targetDate = new Date(date)

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth()
  let daysAgo = currentDate.getDate() - targetDate.getDate()

  let formattedDate = ""

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`
  } else {
    formattedDate = "Today"
  }

  let fullDate = targetDate.toLocaleString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  if (!includeRelative) {
    return fullDate
  }

  return `${fullDate} (${formattedDate})`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export interface TocItem {
  text: string
  id: string
  level: number
}

export function extractHeadings(markdown: string): TocItem[] {
  const withoutCodeBlocks = markdown.replace(/```[\s\S]*?```/g, "")
  const lines = withoutCodeBlocks.split(/\r?\n/)
  const headings: TocItem[] = []
  const slugCounts: Record<string, number> = {}

  for (const line of lines) {
    let level = 0
    let text = ""

    const markdownMatch = line.match(/^(#{2,4})\s+(.+)$/)
    if (markdownMatch) {
      level = markdownMatch[1].length
      text = markdownMatch[2].trim()
    } else {
      const htmlMatch = line.match(/<h([2-4])(?:\s+[^>]*)*>([\s\S]*?)<\/h\1>/i)
      if (htmlMatch) {
        level = parseInt(htmlMatch[1], 10)
        text = htmlMatch[2].trim()
      }
    }

    if (level > 0 && text) {
      const cleanText = text
        .replace(/\[([^\]]+)]\([^)]*\)/g, "$1") // link text
        .replace(/[*_`~]/g, "") // markdown formatting
        .replace(/<[^>]+>/g, "") // remove HTML tags
        .replace(/\\(.)/g, "$1") // remove backslash escapes

      const slug = slugify(cleanText)
      if (slug) {
        headings.push({
          text: cleanText,
          id: slug,
          level,
        })
      }
    }
  }
  return headings
}
export function getReadTime(markdown: string): number {
  const codeMatches = markdown.match(/```[\s\S]*?```/g) || []
  const codeText = codeMatches.join(" ")
  const codeWords = codeText.split(/\s+/).filter(Boolean).length

  const plainText = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_~]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  const words = plainText.split(/\s+/).filter(Boolean).length
  const wordsPerMinute = 238
  const textMins = words / wordsPerMinute
  const codeMins = codeWords / (wordsPerMinute / 2)
  const totalMins = textMins + codeMins

  return Math.max(1, Math.ceil(totalMins))
}
