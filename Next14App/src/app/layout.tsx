import type { Metadata } from 'next'
import { Inter,Raleway  } from 'next/font/google' //see https://www.youtube.com/watch?v=iGherFKlhQg
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const raleway= Raleway({ subsets: ['latin'] })//see https://www.youtube.com/watch?v=iGherFKlhQg

export const metadata: Metadata = {
  title: 'Next 14 App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={raleway.className}>
        {children}
        <div className={inter.className}>Footer</div>
      </body>
    </html>
  )
}
