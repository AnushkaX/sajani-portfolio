import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import { Inter, Pinyon_Script, Playfair_Display } from "next/font/google"
import './globals.css';
import { cn } from '@/lib/utils';
import { RevealController } from '@/components/motion/reveal-controller';

const siteDescription = 'Portfolio of Sajani Muthusinghe, a fashion design student at NIBM.';

export const metadata: Metadata = {
  title: {
    default: 'Sajani Muthusinghe',
    template: '%s | Sajani Muthusinghe',
  },
  description: siteDescription,
  openGraph: {
    title: 'Sajani Muthusinghe',
    description: siteDescription,
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sajani Muthusinghe',
    description: siteDescription,
  },
};

const fontDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-display",
})

const fontSans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
})

const fontSignature = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
  variable: "--font-signature",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontDisplay.variable,
          fontSignature.variable
        )}>
        <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:uppercase focus:tracking-[0.2em]">
          Skip to content
        </a>
        <RevealController />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
