import type { Metadata, Viewport } from "next"
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import '../styles/globals.css'
export const metadata: Metadata = {
  title: "Tweighida comercial LDA",
  description: "App de notes comme archive",
  icons: {
    icon: "/logo.png", // Remplace par le chemin de ton icône
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tweighida",
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      />
      </head>
      <body>  <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow p-4">{children}</main>
      <Footer />
    </div></body>
    </html>
  );
}
