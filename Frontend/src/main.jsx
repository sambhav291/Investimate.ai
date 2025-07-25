import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import AuthCallback from './components/AuthCallback'; // Make sure this path is correct
import { AuthProvider } from './context/AuthContext';
import { ScrollProvider } from "./context/ScrollContext";
import './index.css';
import './App.css';
import "./pdf-worker";

// Get the root element from the DOM
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

// Render the application
root.render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <ScrollProvider>
          <Routes>
            {/* ✅ This is the dedicated route for the Google Login callback. */}
            {/* It will render the AuthCallback component only for this specific path. */}
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* ✅ This route is a "catch-all" that renders your main App component */}
            {/* for every other URL, preserving your single-page app structure. */}
            <Route path="/*" element={<App />} />
          </Routes>
        </ScrollProvider>
      </AuthProvider>
    </Router>
  </StrictMode>
);








// import React, { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// import App from './App';
// import { AuthProvider } from './context/AuthContext';
// import { ScrollProvider } from "./context/ScrollContext";
// import './index.css';
// import './App.css';
// import "./pdf-worker";

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <AuthProvider>
//       <ScrollProvider>
//         <BrowserRouter>
//           <App />
//         </BrowserRouter>
//       </ScrollProvider>
//     </AuthProvider>
//   </StrictMode>
// );








// import React, { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// import './index.css';
// import Dashboard from './components/Dashboard';
// import { AuthProvider } from './context/AuthContext';
// import { ScrollProvider } from "./context/ScrollContext";
// import Navbar from './components/Navbar';
// import './index.css';
// import './App.css';
// import "./pdf-worker";


// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <AuthProvider>
//       <ScrollProvider>
//         <BrowserRouter>
//           <Navbar/>
//           <Dashboard />
//         </BrowserRouter>
//       </ScrollProvider>
//     </AuthProvider>
//   </StrictMode>
// );

