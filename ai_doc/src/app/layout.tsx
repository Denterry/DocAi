import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DocAi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <Providers>
        <html lang="en">
          <body className={inter.className}>{children}</body>
          <Toaster/>
        </html>
      </Providers>
    </ClerkProvider>
  );
}