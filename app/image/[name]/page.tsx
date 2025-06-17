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

export default function ImagePage({ params }: { params: { name: string } }) {
  const fileName = params.name
  
  // Check if the image file exists
  const imagePath = path.join(process.cwd(), 'public/uploads', fileName)
  if (!fs.existsSync(imagePath)) {
    return notFound()
  }
  
  // Use the relative path for the image
  const imageUrl = `/uploads/${fileName}`
  return <ImageView imagePath={imageUrl} fileName={fileName} />
}
