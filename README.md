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

### Installation

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

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Production Deployment

To run the application in production:

```bash
npm run build
npm run start
```

You can deploy this application to any hosting provider that supports Next.js applications.

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

## File Storage

Images are stored in the `/public/uploads` directory. Make sure this directory has appropriate write permissions on your server.

## License

This project is licensed under the MIT License - see the LICENSE file for details.