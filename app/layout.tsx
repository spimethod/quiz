import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Avocado Mental Health Quiz",
  description: "Get your personal mental health report",
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {/* Hide Vercel badges and deployment indicators */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function hideVercelBadges() {
                  // Hide elements with Vercel-related attributes
                  document.querySelectorAll('[data-vercel-badge], [data-vercel-analytics]').forEach(el => {
                    el.style.display = 'none';
                    el.remove();
                  });
                  
                  // Hide iframes from Vercel
                  document.querySelectorAll('iframe[src*="vercel"], iframe[src*="speed-insights"]').forEach(el => {
                    el.style.display = 'none';
                    el.remove();
                  });
                  
                  // Hide fixed position elements in top-right corner
                  document.querySelectorAll('div[style*="position: fixed"]').forEach(el => {
                    const style = el.getAttribute('style') || '';
                    if (style.includes('top') && style.includes('right')) {
                      const rect = el.getBoundingClientRect();
                      if (rect.top < 100 && rect.right > window.innerWidth - 100) {
                        el.style.display = 'none';
                        el.remove();
                      }
                    }
                  });
                }
                
                // Run immediately
                hideVercelBadges();
                
                // Run after DOM is loaded
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', hideVercelBadges);
                }
                
                // Run after page is fully loaded
                window.addEventListener('load', hideVercelBadges);
                
                // Run periodically to catch dynamically added elements
                setInterval(hideVercelBadges, 1000);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
