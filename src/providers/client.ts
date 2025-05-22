import { Client } from "@langchain/langgraph-sdk";

export function createClient(apiUrl: string, apiKey: string | undefined, jwt?: string) {
  return new Client({
    apiKey,
    apiUrl,
    ...(jwt && {
      headers: {
        Authorization: `Bearer ${jwt}`,
        "x-supabase-access-token": jwt,
      },
    }),
  });
}
