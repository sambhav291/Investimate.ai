import React, { createContext, useState, useEffect, useCallback } from 'react';
import { API_ENDPOINTS } from '../utils/apiConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [user, setUser] = useState(null);
  const [authStatus, setAuthStatus] = useState('loading'); 
  const [showLoginModal, setShowLoginModal] = useState(false);

const setAuthData = useCallback((accessToken, newRefreshToken) => {
  setToken(accessToken);
  setRefreshToken(newRefreshToken);
  if (accessToken && newRefreshToken) {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", newRefreshToken);
  } else {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
}, []); // Add useCallback with an empty dependency array

  const logout = useCallback(() => {
    setAuthData(null, null);
    setUser(null);
    setAuthStatus('unauthenticated');
  }, []);

const login = useCallback(async (accessToken, newRefreshToken) => {
  setAuthStatus('loading');
  setAuthData(accessToken, newRefreshToken);
  try {
    const response = await fetch(API_ENDPOINTS.me, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) throw new Error("Failed to fetch user after login");
    const userData = await response.json();
    setUser(userData);
    setAuthStatus('authenticated');
  } catch (e) {
    console.error(e);
    logout();
  }
}, [setAuthData, logout]);

  useEffect(() => {
    // This effect runs only ONCE on initial application load.
    const initializeAuth = async () => {
      const initialToken = localStorage.getItem("access_token");
      const initialRefreshToken = localStorage.getItem("refresh_token");

      if (!initialToken || !initialRefreshToken) {
        setAuthStatus('unauthenticated');
        return;
      }

      // Set tokens in state first
      setToken(initialToken);
      setRefreshToken(initialRefreshToken);

      try {
        // Try to fetch user with the existing token
        const response = await fetch(API_ENDPOINTS.me, {
          headers: { Authorization: `Bearer ${initialToken}` },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setAuthStatus('authenticated');
          return;
        }

        // If it fails (likely expired), try to refresh
        if (response.status === 401) {
          const refreshResponse = await fetch(API_ENDPOINTS.refresh, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: initialRefreshToken }),
          });

          if (refreshResponse.ok) {
            const newTokens = await refreshResponse.json();
            // Use the login flow to handle setting tokens and fetching the user
            await login(newTokens.access_token, newTokens.refresh_token); 
            return;
          }
        }
        
        // If all attempts fail, log out
        logout();

      } catch (error) {
        console.error("Initialization failed:", error);
        logout();
      }
    };

    initializeAuth();
  }, []); 

  return (
    <AuthContext.Provider value={{ token, refreshToken, user, authStatus, login, logout, setAuthData, showLoginModal, setShowLoginModal }}>
      {authStatus !== 'loading' && children}
    </AuthContext.Provider>
  );
};




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




