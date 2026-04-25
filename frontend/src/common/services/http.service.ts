import { API_URL } from "./api.service";

export async function http<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(
    `${API_URL}${path}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    }
  );

  if (!response.ok) {
    throw new Error("Request failed");
  }

  return response.json();
}