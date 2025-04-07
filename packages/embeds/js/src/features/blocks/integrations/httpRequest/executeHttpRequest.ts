import type { ExecutableHttpRequest } from "@typebot.io/blocks-integrations/httpRequest/schema";

export const executeHttpRequest = async (
  httpRequestToExecute: ExecutableHttpRequest,
): Promise<string> => {
  const { url, method, body, headers } = httpRequestToExecute;
  try {
    const response = await fetch(url, {
      method,
      body: method !== "GET" && body ? JSON.stringify(body) : undefined,
      headers,
    });
    const statusCode = response.status;
    const data = await response.json();
    return JSON.stringify({ statusCode, data });
  } catch (error) {
    console.error(error);
    return JSON.stringify({
      statusCode: 500,
      data: "An error occured while executing the webhook on the client",
    });
  }
};
