import './globals.css'

export const metadata = {
  title: 'Image Hosting Service',
  description: 'Upload, share, and embed images easily across the web',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}