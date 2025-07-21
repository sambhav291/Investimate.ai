// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  signup: `${API_BASE_URL}/signup`,
  login: `${API_BASE_URL}/login`,
  logout: `${API_BASE_URL}/logout`,
  refresh: `${API_BASE_URL}/refresh`,
  tokenFromCookie: `${API_BASE_URL}/token/from-cookie`,
  signupMe: `${API_BASE_URL}/signup/me`,
  googleOAuth: `${API_BASE_URL}/auth/google/login`,
  
  // Report endpoints
  generateSummary: `${API_BASE_URL}/generate-summary`,
  generateReport: `${API_BASE_URL}/generate-report`,
  saveReport: `${API_BASE_URL}/save-report`,
  myReports: `${API_BASE_URL}/my-reports`,
  deleteReport: `${API_BASE_URL}/delete-report`,
  previewPdf: `${API_BASE_URL}/preview-pdf`,
};
