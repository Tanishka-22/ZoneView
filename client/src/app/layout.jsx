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
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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

