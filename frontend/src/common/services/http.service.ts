import { API_URL } from "./api.service";

interface ApiResponse<T> {
  message: string;
  data: T;
}

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

  const result: ApiResponse<T> = await response.json();
  return result.data;
}