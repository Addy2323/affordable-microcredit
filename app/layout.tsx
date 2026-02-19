import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { StartupLoader } from "@/components/ui/startup-loader"
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Affordable Microcredit Limited | Improving Lives Through Affordable Credit',
  description: 'Affordable Microcredit Limited provides accessible microfinance services to SMEs and individuals. Apply for loans, manage repayments, and grow your business with our digital financial solutions.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: "/logo.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: "/logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <StartupLoader />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
