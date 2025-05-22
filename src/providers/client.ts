import { Client } from "@langchain/langgraph-sdk";

export function createClient(apiUrl: string, jwt?: string) {
  console.log("[createClient] apiUrl=", apiUrl, "jwt=", jwt);
  const headers = jwt
    ? {
        Authorization: `Bearer ${jwt}`,
        "x-supabase-access-token": jwt,
      }
    : undefined;
  console.log("[createClient] headers=", headers);
  return new Client({
    apiUrl,
    ...(headers && { headers }),
  });
}
