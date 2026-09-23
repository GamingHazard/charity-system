import type { Metadata } from "next";
import { Geist, Geist_Mono, Quicksand } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { DataProvider } from "@/lib/data-context";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const quicksand = Quicksand({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ensigo Of Love| Administration",
   icons: {
    icon: [
      {
        url: "/dark-logo.jpeg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/dark-logo.jpeg",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/dark-logo.jpeg",
        type: "image/svg+xml",
      },
    ],
    apple: "/dark-logo.jpeg",
  },
  // description: "Operations dashboard for Seeds of Love Foundation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${quicksand.className}`}
    >
      <body className="min-h-full antialiased">
        <QueryProvider>
          <AuthProvider>
            <DataProvider>{children}</DataProvider>
          </AuthProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
