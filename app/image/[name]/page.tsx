import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import ImageView from './ImageView'

// This function runs on the server during build time
export async function generateStaticParams() {
  try {
    const uploadDir = path.join(process.cwd(), 'public/uploads')
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
      return []
    }
    
    // Read the directory for image files
    const files = fs.readdirSync(uploadDir)
    return files.map(file => ({
      name: file
    }))
  } catch (error) {
    console.error("Error listing images:", error)
    return []
  }
}

// Define page metadata
export const metadata = {
  title: 'View Image | NextJS Image Hosting',
  description: 'View and share your uploaded image',
}

interface ImagePageProps {
  params: {
    name: string
  }
}

export default function ImagePage({ params }: ImagePageProps) {
  const { name } = params
  
  // Construct the image path
  const imagePath = `/uploads/${name}`
  
  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <ImageView imagePath={imagePath} fileName={name} />
    </main>
  )
}
