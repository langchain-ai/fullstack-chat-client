"use client";

import { Thread } from "@/components/thread";
import { StreamProvider } from "@/providers/Stream";
import { ThreadProvider } from "@/providers/Thread";
import { ArtifactProvider } from "@/components/thread/artifact";
import { Toaster } from "@/components/ui/sonner";
import React from "react";
import { UserInfoSignOut } from "@/features/user-auth-status";

export default function DemoPage(): React.ReactNode {
  return (
    <React.Suspense fallback={<div>Loading (layout)...</div>}>
      <Toaster />
      <div className="mt-2 mb-4 flex w-full flex-col items-center">
        <UserInfoSignOut />
      </div>
      <div className="mt-8 flex w-full flex-col items-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Fullstack Chat
        </h1>
      </div>
      <ThreadProvider>
        <StreamProvider>
          <ArtifactProvider>
            <Thread />
          </ArtifactProvider>
        </StreamProvider>
      </ThreadProvider>
    </React.Suspense>
  );
}
