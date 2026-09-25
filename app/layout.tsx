import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import { DataProvider } from "@/lib/data-context";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

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
    <html lang="en">
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
