# NextJS Image Hosting Service

A simple image hosting service built with Next.js that allows users to upload images, get public URLs for embedding, and provides an API for integration with other websites.

## Features

- 📤 Upload images through a web interface
- 🔗 Get direct image URLs for embedding in websites
- 🧩 API access for uploading from external applications
- 🖼️ Format preservation for all uploaded images
- 📱 Responsive design that works on mobile devices

## Getting Started

### Prerequisites

- Node.js 18.17.0 or newer
- npm or yarn
- Vercel account (for Blob Storage)

### Local Development

1. Clone the repository
```bash
git clone <repository-url>
cd nextjs-image-hosting
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up Vercel Blob Storage:

   a. Install Vercel CLI if you don't have it:
   ```bash
   npm i -g vercel
   ```

   b. Link your project to Vercel:
   ```bash
   vercel link
   ```

   c. Pull environment variables:
   ```bash
   vercel env pull .env.local
   ```
   
   If you're setting up a new project, add a `BLOB_READ_WRITE_TOKEN` to your Vercel environment variables in the Vercel dashboard.

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Production Deployment

To deploy to Vercel:

```bash
vercel
```

Or set up automatic deployments from your GitHub repository.

## API Usage

You can upload images programmatically using the API:

```javascript
const formData = new FormData();
formData.append('file', yourFileObject);

fetch('https://your-deployment-url.com/api/upload', {
  method: 'POST',
  body: formData,
})
.then(response => response.json())
.then(data => {
  console.log('Success:', data);
  // data.url contains the direct URL to the image
  // data.displayUrl contains the URL to the image display page
})
.catch(error => {
  console.error('Error:', error);
});
```

## Environment Variables

Required for production:

```
BLOB_READ_WRITE_TOKEN=<your-vercel-blob-token>
```

Optional:
```
BLOB_STORE_ID=<your-store-id>  # Only if using a custom store
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.