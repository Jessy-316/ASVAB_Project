import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        {/* This script will run on the client side to ensure client-side rendering */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Check if we're on a problematic route
                if (window.location.pathname.startsWith('/instruments')) {
                  // Add a special query parameter to bypass static content
                  const url = new URL(window.location);
                  if (!url.searchParams.has('_bypass')) {
                    url.searchParams.set('_bypass', Date.now().toString());
                    window.history.replaceState({}, '', url);
                    
                    // Force a client-side reload if needed
                    if (document.querySelector('[data-needs-client-reload="true"]')) {
                      window.location.reload();
                    }
                  }
                }
              })();
            `,
          }}
        />
      </body>
    </Html>
  );
} 
