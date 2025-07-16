import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { API_ENDPOINTS } from "./apiConfig";

export const useFetchWithAuth = () => {
  const { refreshToken, setAuthTokens, logout } = useContext(AuthContext);

  return async (url, options = {}) => {
    let accessToken = localStorage.getItem("token"); // ⬅️ always fresh token
    const currentRefreshToken = localStorage.getItem("refresh_token") || refreshToken;

    options.credentials = "include";
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": options.headers?.["Content-Type"] || "application/json",
    };

    let response = await fetch(url, options);

    if (response.status === 401 && currentRefreshToken) {
      try {
        const refreshRes = await fetch(API_ENDPOINTS.REFRESH, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: currentRefreshToken }),
        });

        if (refreshRes.ok) {
          const data = await refreshRes.json();
          console.log("[Auth] Refreshed token received:", data.access_token);

          setAuthTokens(data.access_token, data.refresh_token);

          // ⬅️ Immediately retry request with new token
          options.headers.Authorization = `Bearer ${data.access_token}`;
          response = await fetch(url, options);
        } else {
          logout();
          throw new Error("Session expired. Please log in again.");
        }
      } catch {
        logout();
        throw new Error("Session expired. Please log in again.");
      }
    }

    return response;
  };
};
