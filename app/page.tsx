import { list } from '@vercel/blob';
import Link from 'next/link';

export default async function HomePage() {
  // Get images from Vercel Blob Storage instead of the filesystem
  let imageFiles: { url: string; pathname: string }[] = [];
  
  try {
    const { blobs } = await list();
    imageFiles = blobs;
  } catch (error) {
    console.error('Error fetching blobs:', error);
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Image Hosting Service</h1>
        <Link 
          href="/upload" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Upload New Image
        </Link>
      </div>

      {imageFiles.length === 0 ? (
        <div className="bg-white p-10 rounded-lg shadow-md text-center">
          <h2 className="text-xl mb-4">No images uploaded yet</h2>
          <p className="text-gray-600 mb-6">
            Upload your first image to get started with your image hosting service.
          </p>
          <Link
            href="/upload"
            className="text-blue-600 hover:underline"
          >
            Go to Upload Page
          </Link>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Uploaded Images</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imageFiles.map((file) => (
              <Link 
                href={`/image/${file.pathname}`} 
                key={file.pathname}
                className="block bg-gray-50 p-2 rounded-md hover:shadow-md transition-shadow"
              >
                <div className="aspect-square w-full relative overflow-hidden rounded-md mb-2">
                  <img
                    src={file.url}
                    alt={file.pathname}
                    className="object-cover w-full h-full absolute"
                  />
                </div>
                <div className="truncate text-sm text-gray-600">{file.pathname}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">About This Service</h2>
        <p className="mb-4">
          This NextJS-based image hosting service allows you to:
        </p>
        <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">
          <li>Upload images through a simple UI</li>
          <li>Get direct image URLs for embedding on other websites</li>
          <li>Use our API to upload images from external websites</li>
          <li>Share and distribute your images publicly</li>
        </ul>

        <div className="mt-4">
          <Link 
            href="/upload"
            className="text-blue-600 hover:underline"
          >
            Learn how to use our API →
          </Link>
        </div>
      </div>
    </div>
  );
}