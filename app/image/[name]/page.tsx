import { notFound } from 'next/navigation'
import { list } from '@vercel/blob'
import ImageView from './ImageView'

// This function runs on the server during build time
export async function generateStaticParams() {
  try {
    // Instead of reading local filesystem, list blobs from storage
    const { blobs } = await list();
    return blobs.map(blob => ({
      name: blob.pathname
    }));
  } catch (error) {
    console.error("Error listing blobs:", error);
    return [];
  }
}

export default async function ImagePage({ params }: { params: { name: string } }) {
  // Use the full blob URL as the image path
  const fileName = params.name;
  
  try {
    // List all blobs to find the one with matching pathname
    const { blobs } = await list();
    const matchingBlob = blobs.find(blob => blob.pathname === fileName);
    
    if (!matchingBlob) {
      return notFound();
    }
    
    // Use the blob URL directly
    return <ImageView imagePath={matchingBlob.url} fileName={fileName} />
  } catch (error) {
    console.error("Error fetching blob:", error);
    return notFound();
  }
}
