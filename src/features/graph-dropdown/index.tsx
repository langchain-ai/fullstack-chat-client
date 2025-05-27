import { useEffect, useState } from "react";
import { useAuthContext } from "@/providers/Auth";
import { useQueryState } from "nuqs";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { getDeployments } from "@/lib/environment/deployments";
import { Deployment } from "@/app/types/deployment";
import { Badge } from "@/components/ui/badge";

/**
 * GraphDropdown component - Currently not in use
 *
 * This component has been removed from the UI in favor of using
 * process.env.NEXT_PUBLIC_ASSISTANT_ID to set the graph behind the scenes.
 * The Stream and Thread providers automatically fall back to the environment
 * variable when no assistantId query state is present.
 */
export function GraphDropdown() {
  const { session } = useAuthContext();
  const jwt = session?.accessToken;
  const [assistantId, setAssistantId] = useQueryState("assistantId");
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only load deployments if user is authenticated
    if (!jwt) {
      setDeployments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    // For local development, use static deployments
    try {
      const localDeployments = getDeployments();
      setDeployments(localDeployments);
    } catch (error) {
      console.error("Failed to load deployments:", error);
      setDeployments([]);
    } finally {
      setLoading(false);
    }
  }, [jwt]);

  // Set default selected graph when deployments are loaded and no current selection
  useEffect(() => {
    if (
      !loading &&
      deployments.length > 0 &&
      !assistantId &&
      process.env.NEXT_PUBLIC_ASSISTANT_ID
    ) {
      // Check if the default assistant ID exists in the available deployments
      const defaultDeployment = deployments.find(
        (d) => d.defaultGraphId === process.env.NEXT_PUBLIC_ASSISTANT_ID,
      );

      if (defaultDeployment) {
        setAssistantId(process.env.NEXT_PUBLIC_ASSISTANT_ID);
      }
    }
  }, [loading, deployments, assistantId, setAssistantId]);

  if (loading)
    return (
      <div className="flex min-h-[56px] items-center justify-center">
        Loading graphs...
      </div>
    );
  if (!deployments.length)
    return (
      <div className="flex min-h-[56px] items-center justify-center">
        {" "}
        <Badge
          variant="outline"
          className="mt-2 ml-2 rounded-sm px-2 py-1 text-xs"
        >
          {!jwt ? "Sign in to access graphs" : "No graphs"}
        </Badge>
      </div>
    );

  // Find the selected deployment for badge display
  const selectedDeployment = deployments.find(
    (d) => d.defaultGraphId === assistantId,
  );

  return (
    <div className="flex min-h-[56px] w-full items-center justify-center">
      <Select
        value={assistantId || undefined}
        onValueChange={setAssistantId}
      >
        <SelectTrigger className="w-[240px]">
          <SelectValue placeholder="Select a graph...">
            {selectedDeployment ? (
              <Badge
                variant="outline"
                className="px-2 py-1 text-base"
              >
                {selectedDeployment.name || selectedDeployment.defaultGraphId}
              </Badge>
            ) : null}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {deployments.map((deployment) => (
            <SelectItem
              key={deployment.defaultGraphId || ""}
              value={deployment.defaultGraphId || ""}
            >
              {deployment.name || deployment.defaultGraphId}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
