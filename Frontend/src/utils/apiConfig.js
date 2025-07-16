// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  SIGNUP: `${API_BASE_URL}/signup`,
  LOGIN: `${API_BASE_URL}/login`,
  LOGOUT: `${API_BASE_URL}/logout`,
  REFRESH: `${API_BASE_URL}/refresh`,
  TOKEN_FROM_COOKIE: `${API_BASE_URL}/token/from-cookie`,
  SIGNUP_ME: `${API_BASE_URL}/signup/me`,
  GOOGLE_LOGIN: `${API_BASE_URL}/auth/google/login`,
  
  // Report endpoints
  GENERATE_SUMMARY: `${API_BASE_URL}/generate-summary`,
  GENERATE_REPORT: `${API_BASE_URL}/generate-report`,
  SAVE_REPORT: `${API_BASE_URL}/save-report`,
  MY_REPORTS: `${API_BASE_URL}/my-reports`,
  DELETE_REPORT: (id) => `${API_BASE_URL}/delete-report/${id}`,
  PREVIEW_PDF: (storagePath) => `${API_BASE_URL}/preview-pdf?storage_path=${encodeURIComponent(storagePath)}`,
  MY_REPORTS_BY_ID: (id) => `${API_BASE_URL}/my-reports/${id}`,
};
