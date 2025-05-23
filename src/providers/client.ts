import { Client } from "@langchain/langgraph-sdk";

export function createClient(apiUrl: string, jwt?: string) {
  console.log(
    "[createClient] apiUrl=",
    apiUrl,
    "jwt=",
    jwt ? "present" : "missing",
  );

  // In development, use direct connection since CORS is properly configured
  const clientApiUrl = apiUrl;

  console.log("[createClient] Using clientApiUrl=", clientApiUrl);

  // Configure the client with proper headers
  const config: any = {
    apiUrl: clientApiUrl,
  };

  // Add authorization headers if JWT is present
  if (jwt) {
    config.defaultHeaders = {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    };
  }

  console.log("[createClient] config=", config);

  return new Client(config);
}
