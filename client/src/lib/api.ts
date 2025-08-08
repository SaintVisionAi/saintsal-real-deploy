export async function apiRequest(
  method: string,
  url: string,
  data?: unknown
): Promise<Response> {
  const token = localStorage.getItem("auth_token");
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers: data ? headers : { Authorization: headers.Authorization || "" },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  if (!response.ok) {
    const text = (await response.text()) || response.statusText;
    throw new Error(`${response.status}: ${text}`);
  }

  return response;
}
