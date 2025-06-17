import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { writeFile } from 'fs/promises';

// Use the new route segment configuration format
export const dynamic = 'force-dynamic'; // Make this route dynamic
export const runtime = 'nodejs'; // Use Node.js runtime

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'public/uploads');
fs.mkdirSync(uploadDir, { recursive: true });

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
    const filePath = path.join(uploadDir, fileName);
    
    // Get host information for URL construction
    const host = req.headers.get('host') || '';
    const protocol = host.includes('localhost') ? 'http://' : 'https://';
    const baseUrl = `${protocol}${host}`;
    
    // Convert file to buffer and save to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    // Construct URLs
    const fileUrl = `/uploads/${fileName}`;
    const displayUrl = `/image/${fileName}`;
    
    return NextResponse.json({ 
      success: true, 
      url: fileUrl,
      displayUrl: displayUrl,
      fileName: fileName
    }, { headers });
  } catch (error) {
    console.error('Upload error:', error);
    
    // Provide detailed error response
    let errorMessage = 'Upload failed';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json({ error: errorMessage }, { 
      status: 500,
      headers
    });
  }
}