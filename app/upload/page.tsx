'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [origin, setOrigin] = useState('')
  const [uploadResult, setUploadResult] = useState<{
    url: string;
    displayUrl?: string;
  } | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Set origin after component mounts to avoid window reference during SSR
  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const preventDefault = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text)
        .then(() => alert('Copied to clipboard'))
        .catch(err => console.error('Could not copy:', err))
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }
    
    setError(null)
    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed')
      }
      
      if (data?.url) {
        setUploadResult({
          url: data.url, // This is now a full URL from Blob Storage
          displayUrl: data.displayUrl
        })
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        setFile(null)
      }
    } catch (err: any) {
      setError(err.message || 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Upload Image</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Select an Image</h2>
          
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4"
            onDrop={handleDrop}
            onDragOver={preventDefault}
            onDragEnter={preventDefault}
          >
            {file ? (
              <div className="flex flex-col items-center">
                <div className="mb-3">
                  Selected: <span className="font-semibold">{file.name}</span> ({(file.size / 1024).toFixed(1)} KB)
                </div>
                <button 
                  onClick={() => setFile(null)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <p className="mb-2">Drag & drop an image here, or click to select</p>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)} 
                  className="cursor-pointer"
                />
              </>
            )}
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <button
            onClick={handleUpload}
            disabled={isUploading || !file}
            className={`w-full py-2 rounded-md font-medium ${
              isUploading || !file 
                ? 'bg-blue-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
        
        {/* Result or API Usage Section */}
        {uploadResult ? (
          <div className="bg-white shadow-md rounded-lg p-6 overflow-hidden">
            <h2 className="text-xl font-semibold mb-4">Upload Successful</h2>
            
            <div className="mb-4">
              <img 
                src={uploadResult.url} 
                alt="Uploaded" 
                className="max-h-48 mx-auto rounded"
              />
            </div>
            
            <div className="bg-gray-50 p-3 rounded mb-4">
              <h3 className="font-medium mb-2 text-sm">Direct URL:</h3>
              <div className="flex">
                <input
                  type="text"
                  readOnly
                  value={uploadResult.url} // Direct blob URL
                  className="flex-1 p-2 bg-white border rounded-l text-sm"
                />
                <button 
                  onClick={() => copyToClipboard(uploadResult.url)}
                  className="bg-gray-100 border border-l-0 rounded-r px-3 hover:bg-gray-200"
                >
                  Copy
                </button>
              </div>
            </div>
            
            {uploadResult.displayUrl && (
              <div className="mt-4">
                <Link 
                  href={uploadResult.displayUrl}
                  className="text-blue-600 hover:underline"
                >
                  View Image Page →
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">API Documentation</h2>
            <p className="mb-4">
              You can upload images from other websites using our API:
            </p>
            
            <div className="bg-gray-800 text-gray-200 p-4 rounded-md overflow-x-auto mb-4 text-sm">
              <pre className="whitespace-pre-wrap">
{`// Example upload using JavaScript fetch API
const formData = new FormData();
formData.append('file', yourFileObject); // from file input

fetch('${origin}/api/upload', {
  method: 'POST',
  body: formData,
})
.then(response => response.json())
.then(data => {
  // Use the returned URLs
  console.log(data.url);        // Direct image URL from Blob Storage
  console.log(data.displayUrl); // Page to view the image
})
.catch(error => console.error('Error:', error));`}
              </pre>
            </div>
            
            <p className="text-sm text-gray-500">
              The API supports cross-origin requests, so you can use it from any website.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
