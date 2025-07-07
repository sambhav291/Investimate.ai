import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext'; 
import ErrorMessage from './ErrorMessage';
import { useFetchWithAuth } from "../utils/fetchWithAuth";

export default function Signup({isOpen, onClose}) {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [errorMessage, setErrorMessage] = useState("");
  const { setAuthTokens, fetchUser } = useContext(AuthContext);
  const fetchWithAuth = useFetchWithAuth();

  const submitRegistration = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        username: form.username, 
        email: form.email,
        password: form.password }),
    };
    const response = await fetchWithAuth("http://localhost:8000/signup", requestOptions);
    const data = await response.json();
    if (!response.ok) {
      setErrorMessage(data.detail);
    } 
    else {
      setAuthTokens(data.access_token, data.refresh_token);
      await fetchUser(data.access_token);
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password === form.confirmPassword && form.password.length > 5) {
      submitRegistration();
    } 
    else {
      setErrorMessage(
        "Ensure that the passwords match and greater than 5 characters"
      );
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Sign Up</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <ErrorMessage message={errorMessage} />
          <button
            onClick={handleSubmit}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => window.location.href = "http://localhost:8000/auth/google/login"}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200 mt-4 flex items-center justify-center gap-2"
          >
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
            Signup with Google
          </button>
        </div>
      </div>
    </div>
  );
}

Signup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
