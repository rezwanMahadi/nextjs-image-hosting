'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ImageViewProps {
  imagePath: string  // This will be the full URL from blob storage
  fileName: string
}

export default function ImageView({ imagePath, fileName }: ImageViewProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const [embedUrls, setEmbedUrls] = useState({
    directUrl: '',
    htmlEmbed: '',
    markdownEmbed: ''
  })

  // Set URLs after component mounts - imagePath is already a complete URL
  useEffect(() => {
    // The imagePath is now a full URL from blob storage
    const directUrl = imagePath
    setEmbedUrls({
      directUrl,
      htmlEmbed: `<img src="${directUrl}" alt="Hosted image" />`,
      markdownEmbed: `![Hosted image](${directUrl})`
    })
  }, [imagePath])

  const copyToClipboard = (text: string, type: string) => {
    if (typeof navigator === 'undefined') return
    
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="flex flex-col items-center p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Image: {fileName}</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden w-full mb-8">
        <div className="p-4 bg-gray-50 border-b">
          <h2 className="font-semibold">Image Preview</h2>
        </div>
        <div className="p-4 flex justify-center">
          <img 
            src={imagePath} 
            alt={fileName} 
            className="max-w-full max-h-[600px] object-contain" 
          />
        </div>
      </div>
      
      {embedUrls.directUrl && (
        <div className="bg-gray-50 p-4 rounded-md mb-6 w-full">
          <h2 className="text-lg font-semibold mb-2">Embed Options</h2>
          
          {/* Direct URL */}
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-1">Direct URL:</h3>
            <div className="flex">
              <input 
                type="text" 
                readOnly 
                value={embedUrls.directUrl}
                className="flex-1 p-2 border rounded-l-md bg-white text-sm overflow-x-auto"
              />
              <button 
                onClick={() => copyToClipboard(embedUrls.directUrl, 'url')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 rounded-r-md"
              >
                {copied === 'url' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          
          {/* HTML Embed */}
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-1">HTML Embed:</h3>
            <div className="flex">
              <input 
                type="text" 
                readOnly 
                value={embedUrls.htmlEmbed}
                className="flex-1 p-2 border rounded-l-md bg-white text-sm overflow-x-auto"
              />
              <button 
                onClick={() => copyToClipboard(embedUrls.htmlEmbed, 'html')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 rounded-r-md"
              >
                {copied === 'html' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          
          {/* Markdown Embed */}
          <div>
            <h3 className="text-sm font-medium mb-1">Markdown Embed:</h3>
            <div className="flex">
              <input 
                type="text" 
                readOnly 
                value={embedUrls.markdownEmbed}
                className="flex-1 p-2 border rounded-l-md bg-white text-sm overflow-x-auto"
              />
              <button 
                onClick={() => copyToClipboard(embedUrls.markdownEmbed, 'md')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 rounded-r-md"
              >
                {copied === 'md' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-4">
        <Link href="/upload" className="text-blue-600 hover:underline mr-4">
          Upload another image
        </Link>
        <Link href="/" className="text-blue-600 hover:underline">
          View all images
        </Link>
      </div>
    </div>
  )
} 