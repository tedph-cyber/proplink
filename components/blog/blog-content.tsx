'use client'

import { useMemo } from 'react'
import { marked } from 'marked'

interface BlogContentProps {
  content: string
}

export function BlogContent({ content }: BlogContentProps) {
  const html = useMemo(() => {
    if (!content) return ''
    return marked(content) as string
  }, [content])

  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
