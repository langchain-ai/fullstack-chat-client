import { Deployment } from "@/app/types/deployment";

/**
 * Get deployments for local development
 * For local LangGraph dev server, we use static configuration
 */
export function getLocalDeployments(): Deployment[] {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2024";

  return [
    {
      id: "local-agent",
      deploymentUrl: apiUrl,
      tenantId: "local",
      name: "Agent",
      defaultGraphId: "agent", // Must match your langgraph.json
      isDefault: true,
    },
  ];
}

/**
 * Fetch deployments - for LangGraph Cloud (not used in local dev)
 */
export async function fetchDeployments(jwt: string): Promise<Deployment[]> {
  // This would be used for LangGraph Cloud deployments
  const res = await fetch("/api/deployments", {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch deployments");
  return res.json();
}

/**
 * Get deployments based on environment
 */
export function getDeployments(): Deployment[] {
  // For local development, use static config
  // For production, you'd use fetchDeployments() instead
  const isLocal =
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_API_URL?.includes("localhost");

  if (isLocal) {
    return getLocalDeployments();
  }

  // For production, you'd need to handle async fetchDeployments differently
  throw new Error("Production deployments fetching not implemented yet");
}
