"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useAuthContext } from "@/providers/Auth";
import { supabase } from "@/lib/auth/supabase-client";

interface CreditsContextProps {
  credits: number | null;
  loading: boolean;
  error: string | null;
  refreshCredits: () => Promise<void>;
  updateCredits: (newCredits: number) => void;
  deductCredits: (amount: number) => void;
  addCredits: (amount: number) => void;
}

const CreditsContext = createContext<CreditsContextProps | undefined>(
  undefined,
);

export function CreditsProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuthContext();
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCredits = async () => {
    if (!isAuthenticated || !user?.id) {
      setCredits(null);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("users")
        .select("credits_available")
        .eq("id", user.id)
        .single();

      if (supabaseError) {
        console.error("Error fetching credits:", supabaseError);
        setError("Failed to fetch credits");
        setCredits(0); // Fallback to 0 credits
        return;
      }

      setCredits((data?.credits_available as number) ?? 0);
    } catch (err) {
      console.error("Error fetching credits:", err);
      setError("Failed to fetch credits");
      setCredits(0); // Fallback to 0 credits on any error
    } finally {
      setLoading(false);
    }
  };

  // Update credits optimistically
  const updateCredits = (newCredits: number) => {
    setCredits(newCredits);
  };

  // Deduct credits optimistically
  const deductCredits = (amount: number) => {
    setCredits((prevCredits) => {
      if (prevCredits === null) return null;
      return Math.max(0, prevCredits - amount);
    });
  };

  // Add credits optimistically
  const addCredits = (amount: number) => {
    setCredits((prevCredits) => {
      if (prevCredits === null) return null;
      return prevCredits + amount;
    });
  };

  // Initial fetch when user changes
  useEffect(() => {
    refreshCredits();
  }, [isAuthenticated, user?.id]);

  const value = {
    credits,
    loading,
    error,
    refreshCredits,
    updateCredits,
    deductCredits,
    addCredits,
  };

  return (
    <CreditsContext.Provider value={value}>{children}</CreditsContext.Provider>
  );
}

export function useCreditsContext() {
  const context = useContext(CreditsContext);
  if (context === undefined) {
    throw new Error("useCreditsContext must be used within a CreditsProvider");
  }
  return context;
}
