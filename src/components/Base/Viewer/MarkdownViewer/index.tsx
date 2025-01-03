import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownViewerProps {
  markdownFilePath: string
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ markdownFilePath }) => {
  const [markdownContent, setMarkdownContent] = useState<string>('')

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const response = await fetch(markdownFilePath)
        if (!response.ok) {
          throw new Error(`Failed to fetch markdown file: ${response.statusText}`)
        }

        const text = await response.text()
        setMarkdownContent(text)
      } catch (error) {
        console.error('Error loading markdown file:', error)
      }
    }

    fetchMarkdown()
  }, [markdownFilePath])

  return (
    <div>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownContent}</ReactMarkdown>
    </div>
  )
}

export default MarkdownViewer
