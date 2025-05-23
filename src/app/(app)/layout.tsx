import type { Metadata } from "next";
import "../globals.css";
import React from "react";

export const metadata: Metadata = {
  title: "FullStack Chat - Client",
  description: "FullStack Chat - Client",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
