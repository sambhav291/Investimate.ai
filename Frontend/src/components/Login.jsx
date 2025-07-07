import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import ErrorMessage from './ErrorMessage';
import { useFetchWithAuth } from "../utils/fetchWithAuth";

export default function Login({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { setAuthTokens, fetchUser } = useContext(AuthContext);
  const fetchWithAuth = useFetchWithAuth();
  

  const login = async (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    const response = await fetchWithAuth("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      setErrorMessage(data.detail);
    } else {
      setAuthTokens(data.access_token, data.refresh_token);
      console.log("data.access_token", data.access_token);
      console.log("data.refresh_token", data.refresh_token);
      await fetchUser(data.access_token);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Login</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div>
          <form onSubmit={login}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <ErrorMessage message={errorMessage} />
            <button
              type='submit'
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => window.location.href = "http://localhost:8000/auth/google/login"}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200 mt-4 flex items-center justify-center gap-2"
            >
              <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
              Login with Google
            </button>
          </form>
        </div>
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
// import { X } from 'lucide-react';
// import { AuthContext } from '../context/AuthContext';
// import ErrorMessage from './ErrorMessage';
// import { useFetchWithAuth } from "../utils/fetchWithAuth";

// export default function Login({ isOpen, onClose }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const { setAuthTokens } = useContext(AuthContext);
//   const fetchWithAuth = useFetchWithAuth();
  

//   const login = async (e) => {
//     e.preventDefault();
//     const params = new URLSearchParams();
//     params.append('username', email);
//     params.append('password', password);

//     try {
//       const response = await fetchWithAuth("http://localhost:8000/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         body: params,
//         credentials: "include",
//       });
//       const data = await response.json();
      
//       if (!response.ok) {
//         setErrorMessage(data.detail);
//       } else {
//         // setAuthTokens now handles user fetching internally
//         await setAuthTokens(data.access_token, data.refresh_token);
//         onClose();
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       setErrorMessage('An error occurred during login');
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold text-gray-900">Login</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             <X size={24} />
//           </button>
//         </div>
//         <div>
//           <form onSubmit={login}>
//             <div className="mb-4">
//               <label className="block text-gray-700 text-sm font-bold mb-2">
//                 Email
//               </label>
//               <input
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div className="mb-6">
//               <label className="block text-gray-700 text-sm font-bold mb-2">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <ErrorMessage message={errorMessage} />
//             <button
//               type='submit'
//               className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
//             >
//               Login
//             </button>
//             <button
//               type="button"
//               onClick={() => window.location.href = "http://localhost:8000/auth/google/login"}
//               className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200 mt-4 flex items-center justify-center gap-2"
//             >
//               <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
//               Login with Google
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// Login.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
// };