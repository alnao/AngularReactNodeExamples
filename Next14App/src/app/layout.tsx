import type { Metadata } from 'next'
import { Inter,Raleway  } from 'next/font/google' //see https://www.youtube.com/watch?v=iGherFKlhQg
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })
const raleway= Raleway({ subsets: ['latin'] })//see https://www.youtube.com/watch?v=iGherFKlhQg

export const metadata: Metadata = {
  title: 'Next 14 App',
  description: 'Generated by create next app',
}
//see link https://www.youtube.com/watch?v=6BsPT7AmqSk

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return ( 
    <html lang="en">
      <body className={raleway.className}>
        <header>
          <Link href="/">Home</Link> -  
          <Link href="/component">Api</Link> - 
          <Link href="/component/subcomponent">Subcomponent</Link>
        </header>
        <hr/>
        {children}
        <hr/>
        <div className={inter.className}>Footer</div>
      </body>
    </html>
  )
}
