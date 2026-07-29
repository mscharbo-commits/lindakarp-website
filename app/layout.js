import './globals.css'

export const metadata = {
  title: 'Linda Karp Insurance | Health Insurance Broker',
  description: 'Over 28 years of expertise in health insurance solutions',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
