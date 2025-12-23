const API_URL = import.meta.env.VITE_API_URL;
const FETCH_TIMEOUT = 15000;

export const FetchApi = async ({
  endpoint,
  method = "GET",
  body = null,
  token = null,
}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  try {
    const headers = {};
    if (!(body instanceof FormData))
      headers["Content-Type"] = "application/json";
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body:
        body instanceof FormData ? body : body ? JSON.stringify(body) : null,
      credentials: "include",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const contentType = response.headers.get("content-type");
    const rawText = await response.text();

    if (!response.ok) {
      let json = rawText;
      try {
        json = JSON.parse(rawText);
      } catch {}

      const errorMessage =
        json?.data?.errors ||
        json?.errors ||
        json?.message ||
        "Something went wrong";
      throw new Error(errorMessage);
    }
    return contentType?.includes("application/json")
      ? JSON.parse(rawText)
      : rawText;
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
};
