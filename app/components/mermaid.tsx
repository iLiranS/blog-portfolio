"use client"

import { useEffect, useState, useId } from "react"
import { useTheme } from "next-themes"

interface MermaidProps {
  chart: string
}

export function Mermaid({ chart }: MermaidProps) {
  const uniqueId = useId()
  const { resolvedTheme } = useTheme()
  const [svg, setSvg] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const renderDiagram = async () => {
      try {
        setError(null)

        const mermaid = (await import("mermaid")).default

        // Initialize with light/dark theme dynamically
        mermaid.initialize({
          startOnLoad: false,
          theme: resolvedTheme === "dark" ? "dark" : "default",
          securityLevel: "loose",
        })

        // Clean useId output (colons are invalid in Mermaid IDs)
        const cleanId = `mermaid-${uniqueId.replace(/:/g, "")}`
        const { svg: renderedSvg } = await mermaid.render(cleanId, chart)

        if (isMounted) {
          setSvg(renderedSvg)
        }
      } catch (err: any) {
        console.error("Failed to render mermaid diagram:", err)
        if (isMounted) {
          setError(err?.message || "Error rendering Mermaid diagram")
        }
      }
    }

    renderDiagram()

    return () => {
      isMounted = false
    }
  }, [chart, resolvedTheme, uniqueId])

  if (error) {
    return (
      <div className="my-4 rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-red-500 text-sm overflow-x-auto">
        <p className="font-semibold mb-1">Mermaid Render Error:</p>
        <pre className="font-mono text-xs">{error}</pre>
      </div>
    )
  }

  if (!svg) {
    return (
      <div className="my-4 rounded-lg bg-muted/20 border border-border/40 p-8 text-center text-muted-foreground text-sm animate-pulse">
        <span>Rendering diagram...</span>
        <noscript>
          <pre className="text-left font-mono text-xs whitespace-pre">{chart}</pre>
        </noscript>
      </div>
    )
  }

  return (
    <div
      className="my-6 overflow-x-auto p-4 rounded-xl bg-muted/10 border border-border/40"
      role="img"
      aria-label="Mermaid diagram"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
