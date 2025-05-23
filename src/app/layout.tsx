import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import React from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { AuthProvider } from "@/providers/Auth";
import { CreditsProvider } from "@/providers/Credits";
import AuthLayout from "./auth-layout";

const inter = Inter({
  subsets: ["latin"],
  preload: true,
  display: "swap",
});

export const metadata: Metadata = {
  title: "Agent Chat",
  description: "Agent Chat UX by LangChain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NuqsAdapter>
          <AuthProvider>
            <CreditsProvider>
              <AuthLayout>{children}</AuthLayout>
            </CreditsProvider>
          </AuthProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
