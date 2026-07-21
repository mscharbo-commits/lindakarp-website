import './globals.css'

export const metadata = {
  title: 'Linda Karp Insurance | Health Insurance Broker',
  description: 'Over 28 years of expertise in health insurance solutions',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
