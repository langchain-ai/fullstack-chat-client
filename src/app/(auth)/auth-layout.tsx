"use client";

import React from "react";
import { useAuthContext } from "@/providers/Auth";
import { Skeleton } from "@/components/ui/skeleton";

// Layout component for pages that don't need the sidebar (auth pages)
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="container flex min-h-screen items-center justify-center py-10">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="mx-auto h-8 w-3/4" />
          <Skeleton className="mx-auto h-4 w-1/2" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return children;
}
