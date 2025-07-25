import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { X, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useFetchWithAuth } from "../utils/fetchWithAuth";
import { API_ENDPOINTS } from '../utils/apiConfig';

export default function Login({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setAuthTokens, fetchUser } = useContext(AuthContext);
  const fetchWithAuth = useFetchWithAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // ✅ **THE FIX IS APPLIED HERE**
      // The request is now correctly configured to send a JSON payload.
      const response = await fetchWithAuth(API_ENDPOINTS.login, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        // The body is a JSON string with 'email' and 'password' keys, matching the backend model.
        body: JSON.stringify({ email, password }),
        // This line is essential for sending credentials (like cookies) across domains.
        credentials: "include",
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Use the detailed error message from the backend if it exists.
        setErrorMessage(data.detail || 'Login failed. Please check your credentials.');
      } else {
        // On success, store tokens, fetch user data, and close the modal.
        setAuthTokens(data.access_token, data.refresh_token);
        await fetchUser(data.access_token);
        onClose();
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // --- ALL OF YOUR EXISTING JSX AND STYLING IS PRESERVED BELOW ---
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl min-h-[400px] max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Gradient border effect */}
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20 rounded-3xl blur-sm -z-10"></div>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-white/70 mt-1">Sign in to your account</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-white/60 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/90 uppercase tracking-wide">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:bg-white/10"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/90 uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:bg-white/10"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 backdrop-blur-sm">
              <p className="text-red-300 text-sm">{errorMessage}</p>
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
            <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <span className="text-white/60 text-sm">or</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={() => window.location.href = API_ENDPOINTS.googleOAuth}
            className="w-full bg-white/5 border border-white/10 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 hover:bg-white/10 hover:shadow-lg hover:shadow-white/10 hover:scale-105 flex items-center justify-center gap-3 backdrop-blur-sm"
          >
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
}

Login.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};





// import React, { useState, useContext } from 'react';
// import PropTypes from 'prop-types';
// import { X, Eye, EyeOff, Mail, Lock } from 'lucide-react';
// import { AuthContext } from '../context/AuthContext';
// import ErrorMessage from './ErrorMessage';
// import { useFetchWithAuth } from "../utils/fetchWithAuth";
// import { API_ENDPOINTS } from '../utils/apiConfig';

// export default function Login({ isOpen, onClose }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const { setAuthTokens, fetchUser } = useContext(AuthContext);
//   const fetchWithAuth = useFetchWithAuth();

//   const login = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setErrorMessage('');
    
//     const params = new URLSearchParams();
//     params.append('username', email);
//     params.append('password', password);

//     try {
//       // const response = await fetchWithAuth("http://localhost:8000/signup", {
//       const response = await fetchWithAuth(API_ENDPOINTS.login, {
//         method: "POST",
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         body: params,
//         credentials: "include",
//       });
//       const data = await response.json();
      
//       if (!response.ok) {
//         setErrorMessage(data.detail);
//       } else {
//         setAuthTokens(data.access_token, data.refresh_token);
//         await fetchUser(data.access_token);
//         onClose();
//       }
//     } catch (error) {
//       setErrorMessage('An error occurred during login');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
//       {/* Animated background orbs */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
//         <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
//       </div>

//       <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl min-h-[400px] max-h-[90vh] overflow-y-auto flex flex-col">
//         {/* Gradient border effect */}
//         <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20 rounded-3xl blur-sm -z-10"></div>
        
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
//               Welcome Back
//             </h2>
//             <p className="text-white/70 mt-1">Sign in to your account</p>
//           </div>
//           <button 
//             onClick={onClose} 
//             className="text-white/60 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
//           >
//             <X size={24} />
//           </button>
//         </div>

//         <form onSubmit={login} className="space-y-6">
//           {/* Email Field */}
//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-white/90 uppercase tracking-wide">
//               Email
//             </label>
//             <div className="relative">
//               <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:bg-white/10"
//                 placeholder="Enter your email"
//                 required
//               />
//             </div>
//           </div>

//           {/* Password Field */}
//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-white/90 uppercase tracking-wide">
//               Password
//             </label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
//               <input
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:bg-white/10"
//                 placeholder="Enter your password"
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
//               >
//                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>
//           </div>

//           {/* Error Message */}
//           {errorMessage && (
//             <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 backdrop-blur-sm">
//               <p className="text-red-300 text-sm">{errorMessage}</p>
//             </div>
//           )}

//           {/* Login Button */}
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
//           >
//             {isLoading ? (
//               <div className="flex items-center justify-center gap-2">
//                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                 Signing in...
//               </div>
//             ) : (
//               'Sign In'
//             )}
//             <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
//           </button>

//           {/* Divider */}
//           <div className="flex items-center gap-4 my-6">
//             <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
//             <span className="text-white/60 text-sm">or</span>
//             <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
//           </div>

//           {/* Google Login Button */}
//           <button
//             type="button"
//             onClick={() => window.location.href = API_ENDPOINTS.googleOAuth}
//             className="w-full bg-white/5 border border-white/10 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 hover:bg-white/10 hover:shadow-lg hover:shadow-white/10 hover:scale-105 flex items-center justify-center gap-3 backdrop-blur-sm"
//           >
//             <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
//             Continue with Google
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// Login.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
// };








