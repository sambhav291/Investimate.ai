export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://investimate-backend-cedqfyhyhsfpdbg4.centralindia-01.azurewebsites.net';

// API Endpoints
export const API_ENDPOINTS = {
  // --- Auth endpoints ---
  // All these routes are prefixed with '/auth' as defined in your auth.py
  signup: `${API_BASE_URL}/auth/signup`,
  login: `${API_BASE_URL}/auth/login`,
  me: `${API_BASE_URL}/auth/me`,
  googleOAuth: `${API_BASE_URL}/auth/google/login`,
  refresh: `${API_BASE_URL}/auth/refresh`, 
  
  // --- Report endpoints ---
  // These routes are defined in main.py at the root level (no prefix)
  generateSummary: `${API_BASE_URL}/generate-summary`,
  summaryStatus: `${API_BASE_URL}/summary-status`,
  generateReport: `${API_BASE_URL}/generate-report`,
  reportStatus: `${API_BASE_URL}/report-status`, 
  saveReport: `${API_BASE_URL}/save-report`,
  myReports: `${API_BASE_URL}/my-reports`,
  deleteReport: `${API_BASE_URL}/delete-report`,
  previewPdf: `${API_BASE_URL}/preview-pdf`,
};
