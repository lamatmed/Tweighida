import type { Metadata } from "next"
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import '../styles/globals.css'
export const metadata: Metadata = {
  title: "Tweighida comercial LDA",
  description: "App de notes comme archive",
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
