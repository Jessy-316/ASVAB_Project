import type { Metadata } from 'next'
import localFont from 'next/font/local'
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import { headers } from 'next/headers'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'ASVABProject',
  description: 'ASVAB Project',
  icons: {
    icon: '/asvab-favicon.png',
  },
}

// This component dynamically imports the BypassStaticWrapper on the client side only
function ClientOnly({ children, path }: { children: React.ReactNode; path: string }) {
  return (
    <>
      {/* During SSR, just render the children */}
      {children}
      
      {/* 
        On client side, this script will check if we need to inject
        the bypass for certain routes like /instruments
      */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const path = ${JSON.stringify(path)};
              if (path.startsWith('/instruments')) {
                // Add a special flag to avoid static content
                const url = new URL(window.location);
                if (!url.searchParams.has('_bypass')) {
                  url.searchParams.set('_bypass', Date.now().toString());
                  window.history.replaceState({}, '', url);
                }
              }
            })();
          `,
        }}
      />
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get the current path to check if we're on a route that needs special handling
  const headersList = headers();
  const path = headersList.get('x-pathname') || '';
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientOnly path={path}>
            {children}
          </ClientOnly>
        </ThemeProvider>
      </body>
    </html>
  )
}
