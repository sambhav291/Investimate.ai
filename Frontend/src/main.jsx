import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ScrollProvider } from "./context/ScrollContext";
import './index.css';
import './App.css';
import "./pdf-worker";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ScrollProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ScrollProvider>
    </AuthProvider>
  </StrictMode>
);








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

