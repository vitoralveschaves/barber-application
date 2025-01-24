import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./_components/footer";
import { SessionProvider } from "next-auth/react"
import { Toaster } from "@/app/_components/ui/sonner"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} dark`}>
        <SessionProvider>
          {children}
          <Toaster />
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
