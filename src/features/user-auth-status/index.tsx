import { useAuthContext } from "@/providers/Auth";
import React from "react";
import type { User } from "@/lib/auth/types";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
export function UserInfoSignOut() {
  const { user, signOut, isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="mt-2 flex animate-pulse items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-gray-200" />
        <span className="text-sm text-gray-400">Loading...</span>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <SignedInView
        user={user}
        signOut={signOut}
      />
    );
  }

  return <SignedOutView />;
}

interface SignedInViewProps {
  user: User | null;
  signOut: () => Promise<{
    error: import("@/lib/auth/types").AuthError | null;
  }>;
}

function SignedInView({ user, signOut }: SignedInViewProps) {
  return (
    <div className="mt-2 flex items-center gap-2">
      {user?.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={user.displayName || user.email || "User"}
          className="h-8 w-8 rounded-full border object-cover"
        />
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-gray-200 font-bold text-gray-500">
          {user?.displayName?.[0]?.toUpperCase() ||
            user?.email?.[0]?.toUpperCase() ||
            "U"}
        </div>
      )}
      <span
        className="max-w-[240px] truncate text-sm"
        title={user?.displayName || user?.email || undefined}
      >
        {user?.displayName || user?.email}
        <Badge
          variant="outline"
          className="ml-2 rounded-sm px-2 py-1 text-xs"
        >
          {" "}
          {user?.email}
        </Badge>
      </span>
      <button
        className="ml-1 rounded border bg-white px-2 py-1 text-xs hover:bg-gray-50"
        onClick={async () => {
          await signOut();
        }}
      >
        Sign Out
      </button>
    </div>
  );
}

function SignedOutView() {
  const router = useRouter();
  return (
    <div className="mt-2 flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-gray-100 text-gray-400">
        <span className="text-lg font-bold">?</span>
      </div>

      <button
        className="ml-1 rounded border bg-white px-2 py-1 text-xs hover:bg-gray-50"
        onClick={() => router.push("/signin")}
      >
        Sign In
      </button>
      <button
        className="ml-1 rounded border bg-white px-2 py-1 text-xs hover:bg-gray-50"
        onClick={() => router.push("/signup")}
      >
        Sign Up
      </button>
    </div>
  );
}
