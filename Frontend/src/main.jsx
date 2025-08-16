import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import AuthCallback from './components/AuthCallback'; 
import { AuthProvider } from './context/AuthContext';
import { ScrollProvider } from "./context/ScrollContext";
import './index.css';
import './App.css';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

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
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/*" element={<App />} />
          </Routes>
        </ScrollProvider>
      </AuthProvider>
    </Router>
  </StrictMode>
);




