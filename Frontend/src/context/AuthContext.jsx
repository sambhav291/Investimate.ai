import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { API_BASE_URL } from '../utils/apiConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token') || null);
  const [user, setUser] = useState(null);
  const [authStatus, setAuthStatus] = useState('idle'); // idle | loading | authenticated | unauthenticated
  const [authMethod, setAuthMethod] = useState(localStorage.getItem('authMethod') || null);

  const initializedRef = useRef(false);

  // --- NEW: Function to handle Google OAuth callback ---
  // This function will be called once on page load to check if we've just returned from Google login.
  const handleGoogleCallback = async () => {
    // We add a query parameter `?source=google` to the redirect URL from the backend.
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('source') === 'google') {
      try {
        // The backend has set an httpOnly cookie. We now ask the backend to convert
        // that cookie into a JWT token that we can store in localStorage.
        const tokenRes = await fetch(`${API_BASE_URL}/token/from-cookie`, {
          method: "POST",
          credentials: "include", // This sends the cookie to the backend
        });

        if (tokenRes.ok) {
          const tokens = await tokenRes.json();
          // By setting the tokens here, we unify the Google login with the JWT login.
          setAuthTokens(tokens.access_token, tokens.refresh_token, 'google');
          // Clean up the URL
          window.history.replaceState(null, '', window.location.pathname);
          return true; // Indicate that we handled a callback
        }
      } catch (error) {
        console.error("Failed to exchange Google cookie for token:", error);
      }
    }
    return false; // No callback was handled
  };

  // On mount: check for Google callback first, then fetch user
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const initializeAuth = async () => {
      setAuthStatus('loading');
      
      // First, check if this is a redirect from Google login
      const isGoogleCallback = await handleGoogleCallback();
      if (isGoogleCallback) {
        // If it was a Google callback, the user will be fetched by the token useEffect.
        // We can stop the initialization here to avoid race conditions.
        return;
      }
      
      // If not a Google callback, proceed with normal user fetching based on existing tokens
      if (localStorage.getItem('token')) {
        await fetchUser(localStorage.getItem('token'));
      } else {
        setAuthStatus('unauthenticated');
      }
    };

    initializeAuth();
  }, []);

  // Effect that runs whenever the token changes to fetch user data
  useEffect(() => {
    if (token) {
      fetchUser(token);
    }
  }, [token]);


  const fetchUser = async (accessToken) => {
    if (!accessToken) {
        setAuthStatus('unauthenticated');
        return;
    }
    setAuthStatus('loading');
    try {
      const res = await fetch(`${API_BASE_URL}/signup/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        setAuthStatus('authenticated');
      } else if (res.status === 401 && refreshToken) {
        // Token expired, try to refresh it
        await refreshAndRetry(accessToken);
      } else {
        // Any other error, log out
        logout();
      }
    } catch (err) {
      console.error('Auth fetch failed:', err);
      logout();
    }
  };

  const refreshAndRetry = async (expiredToken) => {
    try {
        const refreshRes = await fetch(`${API_BASE_URL}/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (refreshRes.ok) {
            const data = await refreshRes.json();
            setAuthTokens(data.access_token, data.refresh_token, 'jwt');
            // The useEffect for token changes will automatically re-fetch the user.
        } else {
            logout();
        }
    } catch (error) {
        console.error("Token refresh failed:", error);
        logout();
    }
  };

  const setAuthTokens = (access, refresh, method) => {
    setToken(access);
    setRefreshToken(refresh);
    setAuthMethod(method);
    localStorage.setItem('token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('authMethod', method);
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }

    setToken(null);
    setRefreshToken(null);
    setUser(null);
    setAuthMethod(null);
    setAuthStatus('unauthenticated');
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('authMethod');

    // Clear any remaining session cookies
    document.cookie = "access_token_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "refresh_token_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        setAuthTokens,
        logout,
        user,
        authStatus,
        authMethod,
        fetchUser,
      }}
    >
      {authStatus !== 'loading' && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
    return useContext(AuthContext);
}





// import React, { createContext, useState, useEffect, useRef } from 'react';
// import PropTypes from 'prop-types';
// import { API_BASE_URL } from '../utils/apiConfig';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(localStorage.getItem('token') || null);
//   const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token') || null);
//   const [user, setUser] = useState(null);
//   const [authStatus, setAuthStatus] = useState('idle'); // idle | loading | authenticated | unauthenticated
//   const [authMethod, setAuthMethod] = useState(null); // 'jwt' | 'google'

//   const initializedRef = useRef(false);

//   // On mount: attempt to get user via cookie or token
//   useEffect(() => {
//     if (initializedRef.current) return;
//     initializedRef.current = true;

//     const fetchUser = async () => {
//       setAuthStatus('loading');

//       try {
//         // CASE 1: No token → Try Google login (cookie-based)
//         if (!token && !refreshToken) {
//           const res = await fetch(`${API_BASE_URL}/signup/me`, {
//             method: "GET",
//             credentials: "include",
//           });

//           if (res.ok) {
//             const userData = await res.json();
//             setUser(userData);
//             setAuthMethod('google');
//             setAuthStatus('authenticated');

//             const tokenRes = await fetch(`${API_BASE_URL}/token/from-cookie`, {
//               method: "POST",
//               credentials: "include",
//             });

//             if (tokenRes.ok) {
//               const tokens = await tokenRes.json();
//               setToken(tokens.access_token);
//               setRefreshToken(tokens.refresh_token);
//               localStorage.setItem("token", tokens.access_token);
//               localStorage.setItem("refresh_token", tokens.refresh_token);
//             }
//             return;
//           } else {
//             setAuthStatus('unauthenticated');
//             return;
//           }
//         }

//         // CASE 2: Token exists → validate it
//         if (token) {
//           const res = await fetch(`${API_BASE_URL}/signup/me`, {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': "Bearer " + token,
//             },
//           });

//           // If expired, try refresh
//           if (res.status === 401 && refreshToken) {
//             const refreshRes = await fetch(`${API_BASE_URL}/refresh`, {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({ refresh_token: refreshToken }),
//             });

//             if (refreshRes.ok) {
//               const data = await refreshRes.json();
//               setToken(data.access_token);
//               setRefreshToken(data.refresh_token);
//               localStorage.setItem("token", data.access_token);
//               localStorage.setItem("refresh_token", data.refresh_token);

//               const retryRes = await fetch(`${API_BASE_URL}/signup/me`, {
//                 method: 'GET',
//                 headers: {
//                   'Content-Type': 'application/json',
//                   'Authorization': "Bearer " + data.access_token,
//                 },
//               });

//               if (retryRes.ok) {
//                 const userData = await retryRes.json();
//                 setUser(userData);
//                 setAuthMethod('jwt');
//                 setAuthStatus('authenticated');
//               } else {
//                 logout();
//               }
//             } else {
//               logout();
//             }
//           } else if (res.ok) {
//             const userData = await res.json();
//             setUser(userData);
//             setAuthMethod('jwt');
//             setAuthStatus('authenticated');
//           } else {
//             logout();
//           }
//         }
//       } catch (err) {
//         console.error('Auth fetch failed:', err);
//         logout();
//       }
//     };

//     fetchUser();
//   }, []);

//   // 🔁 Refresh token periodically (JWT only)
//   useEffect(() => {
//     if (!token || !refreshToken || authMethod === 'google') return;

//     const interval = setInterval(async () => {
//       try {
//         const payload = JSON.parse(atob(token.split('.')[1]));
//         const exp = payload.exp * 1000;

//         if (Date.now() > exp - 30000) {
//           const res = await fetch(`${API_BASE_URL}/refresh`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ refresh_token: refreshToken }),
//             credentials: "include",
//           });

//           if (res.ok) {
//             const data = await res.json();
//             setToken(data.access_token);
//             setRefreshToken(data.refresh_token);
//             localStorage.setItem("token", data.access_token);
//             localStorage.setItem("refresh_token", data.refresh_token);

//             await fetchUser(data.access_token); // ✅ Always update user too
//           } else {
//             logout();
//           }
//         }
//       } catch (err) {
//         console.error("Token refresh failed:", err);
//         logout();
//       }
//     }, 15000); // Check every 15 seconds

//     return () => clearInterval(interval);
//   }, [token, refreshToken, authMethod]);

//   // Update fetchUser to always set user with username or name
//   const fetchUser = async (accessToken = token) => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/signup/me`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': "Bearer " + accessToken,
//         },
//       });
//       if (res.ok) {
//         const userData = await res.json();
//         setUser(userData);
//         setAuthStatus('authenticated');
//       } else {
//         console.error('Failed to fetch user');
//       }
//     } catch (err) {
//       console.error('Fetch user error:', err);
//     }
//   };

//   const setAuthTokens = (access, refresh) => {
//     setToken(access);
//     setRefreshToken(refresh);
//     localStorage.setItem('token', access);
//     localStorage.setItem('refresh_token', refresh);
//     setAuthMethod('jwt');
//     setAuthStatus('authenticated');
//   };

//   const logout = async () => {
//     try {
//       await fetch(`${API_BASE_URL}/logout`, {
//         method: "POST",
//         credentials: "include",
//       });
//     } catch (err) {
//       console.error("Logout failed:", err);
//     }

//     setToken(null);
//     setRefreshToken(null);
//     setUser(null);
//     setAuthMethod(null);
//     setAuthStatus('unauthenticated');
//     localStorage.removeItem('token');
//     localStorage.removeItem('refresh_token');

//     document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//     document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         token,
//         refreshToken,
//         setAuthTokens,
//         logout,
//         user,
//         setUser,
//         authStatus,
//         authMethod,
//         fetchUser,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// AuthProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };




