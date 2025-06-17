import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { randomUUID } from 'crypto';
import path from 'path';

// Use the new route segment configuration format
export const dynamic = 'force-dynamic'; // Make this route dynamic
export const runtime = 'nodejs'; // Use Node.js runtime

export async function POST(req: NextRequest) {
  // Add CORS headers for cross-origin requests
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { 
        status: 400,
        headers
      });
    }

    // Get file extension from original name
    const originalName = file.name;
    const fileExt = path.extname(originalName).toLowerCase();
    
    // Validate file type (optional - you can customize this list)
    const validTypes = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
    if (!validTypes.includes(fileExt)) {
      return NextResponse.json({ error: 'Invalid file type' }, { 
        status: 400,
        headers
      });
    }

    // Create unique filename with original extension
    const uniqueId = randomUUID();
    const fileName = `${uniqueId}${fileExt}`;
    
    // Instead of saving to filesystem, save to Vercel Blob Storage
    const blob = await put(fileName, file, {
      access: 'public',
    });

    // The blob.url contains the full URL to the uploaded file
    const fileUrl = blob.url;
    const displayUrl = `/image/${fileName}`;
    const host = req.headers.get('host') || '';
    
    return NextResponse.json({ 
      success: true, 
      url: fileUrl,  // This is now the full URL from Vercel Blob
      displayUrl: displayUrl,
      fileName: fileName
    }, { headers });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { 
      status: 500,
      headers
    });
  }
}