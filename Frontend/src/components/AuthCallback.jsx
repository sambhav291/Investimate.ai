import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Make sure this path is correct

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext); // Assuming your context has a login function

  useEffect(() => {
    // This effect runs when the component mounts
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken && refreshToken) {
      console.log("Tokens received from URL, logging in...");
      // Use the login function from your AuthContext to store the tokens
      login(accessToken, refreshToken);
      // Redirect to the main dashboard or services page after successful login
      navigate('/services'); 
    } else {
      console.error("Authentication failed: No tokens found in URL.");
      // If no tokens are found, redirect to the login page with an error
      navigate('/login?error=auth_failed');
    }
  }, [location, login, navigate]);

  // This component will just show a loading message while it processes the redirect.
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="text-center">
        <p className="text-xl">Finalizing authentication, please wait...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
