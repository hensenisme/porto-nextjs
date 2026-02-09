import "./globals.css";
// 1. Impor file styling WordPress baru
import "../styles/wordpress-content.css";
import { Poppins, Plus_Jakarta_Sans } from 'next/font/google';

// Impor-impor asli dari template
import Script from "next/script";
import Lines from "@/components/common/Lines";
import ProgressScroll from "@/components/common/ProgressScroll";
import Cursor from "@/components/common/cusor";
import LoadingScreen from "@/components/common/loader";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import DisableRightClick from "@/components/common/DisableRightClick";
import { DeviceProvider } from '@/contexts/DeviceContext';
import NextTopLoader from 'nextjs-toploader';

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

// Global Metadata
export const metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: {
    default: "Hendri Gunawan - Software & IoT Engineer",
    template: "%s | Hendri Gunawan - Software & IoT Engineer"
  },
  description: "Software & IoT Engineer focused on modern digital product development. Expert in React, Next.js, Flutter, and IoT Systems.",
  keywords: ["Software Engineer", "IoT Engineer", "Next.js Developer", "React Developer", "Hendri Gunawan"],
  authors: [{ name: "Hendri Gunawan" }],
  creator: "Hendri Gunawan",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com",
    siteName: "Hendri Gunawan Portfolio",
    title: "Hendri Gunawan - Software & IoT Engineer",
    description: "Software & IoT Engineer focused on modern digital product development.",
    images: [
      {
        url: "/assets/imgs/header/p0.jpg",
        width: 1200,
        height: 630,
        alt: "Hendri Gunawan Portfolio",
      },
    ],
  },
  icons: {
    icon: "/assets/imgs/favicon.ico",
    shortcut: "/assets/imgs/favicon.ico",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${plusJakartaSans.variable}`}>
      <head>
        {/* Link CSS asli */}
        <link rel="stylesheet" href="/assets/css/plugins.css" />
        <link rel="stylesheet" href="/assets/css/style.css" />
      </head>
      <body className={poppins.className}>
        <DeviceProvider>
          <NextTopLoader color="#fd5b38" showSpinner={false} zIndex={99999} />
          <DisableRightClick />
          <LoadingScreen />
          <Cursor />
          <ProgressScroll />
          <Lines />
          <div id="smooth-wrapper">
            <Navbar />
            <div id="smooth-content">
              {/* Semua konten halaman akan dirender di sini */}
              {children}
              <Footer />
            </div>
          </div>
        </DeviceProvider>

        {/* Error Suppression Script - Blokir error dari script pihak ketiga */}
        <Script
          id="error-suppressor"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                if (e.filename && (
                  e.filename.includes('share-modal') || 
                  e.filename.includes('addFrameListener')
                )) {
                  e.preventDefault();
                  console.warn('[Suppressed] Error from:', e.filename);
                  return true;
                }
              }, true);
            `,
          }}
        />

        {/* Script global asli - Purged GSAP & Isotope (Legacy) */}
        <Script src="/assets/js/plugins.js" strategy="afterInteractive" />
        <Script src="/assets/js/splitting.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/scripts.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}

