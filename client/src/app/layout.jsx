import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import ErrorBoundary from "./components/ErrorBoundary";
import GlobalErrorHandler from "./components/GlobalErrorHandler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "XXX-ZoneView",
  description: "A compilation of all the projects done by HTL Aircon",
  icons: {
    icon: '/marker-icon.png',
  },
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/marker-icon.png" type="image/png" sizes="32x32" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Suppress browser extension errors early
              window.addEventListener('error', function(e) {
                if (e.filename && (
                  e.filename.includes('share-modal') ||
                  e.filename.includes('extension') ||
                  e.filename.includes('favicon') ||
                  e.message.includes('addEventListener') && e.message.includes('null') ||
                  e.message.includes('favicon') ||
                  e.message.includes('Failed to load resource')
                )) {
                  e.preventDefault();
                  return false;
                }
              });

              // Suppress unhandled rejections
              window.addEventListener('unhandledrejection', function(e) {
                if (e.reason && (
                  e.reason.toString().includes('share-modal') ||
                  e.reason.toString().includes('favicon') ||
                  e.reason.toString().includes('addEventListener')
                )) {
                  e.preventDefault();
                  return false;
                }
              });
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <GlobalErrorHandler>
          <ErrorBoundary>
            {/* Fixed Navbar */}
            <div className="shrink-0">
              <Navbar />
            </div>

            {/* Main content area below navbar */}
            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </ErrorBoundary>
        </GlobalErrorHandler>
      </body>
    </html>
  );
}

