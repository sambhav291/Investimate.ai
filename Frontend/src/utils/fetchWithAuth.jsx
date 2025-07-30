import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { API_ENDPOINTS } from "./apiConfig";

export const useFetchWithAuth = () => {
  const { refreshToken, setAuthTokens, logout } = useContext(AuthContext);

  return async (url, options = {}) => {
    let accessToken = localStorage.getItem("token"); // ⬅️ always fresh token
    const currentRefreshToken = localStorage.getItem("refresh_token") || refreshToken;

// Create a new Headers object to avoid overwriting issues
    const headers = new Headers(options.headers || {});
    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }
    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }
    const finalOptions = {
        ...options,
        credentials: "include",
        headers: headers,
    };

    let response = await fetch(url, finalOptions);

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
          finalOptions.headers.set('Authorization', `Bearer ${data.access_token}`);
          response = await fetch(url, finalOptions);
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
