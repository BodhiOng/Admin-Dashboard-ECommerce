"use client";

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';

// Define the props for the AddAdminModal
interface AddAdminModalProps {
  isOpen: boolean;
  formData: any;
  onClose: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (data: any) => void;
}

export default function AddAdminModal({
  isOpen,
  formData,
  onClose,
  onInputChange,
  onSubmit
}: AddAdminModalProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isValid, setIsValid] = useState(false);

  // Use useRef to store the latest values without causing re-renders
  const passwordRef = useRef(password);
  const confirmPasswordRef = useRef(confirmPassword);

  // Update refs when state changes
  useEffect(() => {
    passwordRef.current = password;
    confirmPasswordRef.current = confirmPassword;
  }, [password, confirmPassword]);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    if (newPassword !== passwordRef.current) {
      setPassword(newPassword);
      setPasswordError('');
    }
  }, []);

  const handleConfirmPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = e.target.value;
    if (newConfirmPassword !== confirmPasswordRef.current) {
      setConfirmPassword(newConfirmPassword);
      setPasswordError('');
    }
  }, []);

  // Memoize the password validation
  const passwordsMatch = useMemo(() => {
    return password === confirmPassword;
  }, [password, confirmPassword]);

  // Update validation status whenever relevant fields change
  useEffect(() => {
    const isPasswordValid = password.trim() !== '' && 
                          confirmPassword.trim() !== '' && 
                          passwordsMatch &&
                          password.length >= 8;
    
    if (password && password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
    } else if (!passwordsMatch && password && confirmPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }

    const formIsValid = formData.username?.trim() !== '' &&
                       formData.email?.trim() !== '' &&
                       formData.phoneNumber?.trim() !== '' &&
                       isPasswordValid;
    
    setIsValid(formIsValid);
  }, [password, confirmPassword, passwordsMatch, formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      // Explicitly add password to formData before submission
      const updatedFormData = {
        ...formData,
        password: password
      };
      
      // Directly pass updated form data
      onSubmit(updatedFormData);
      
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-6 border-b relative">
          <h2 className="text-xl font-semibold text-gray-800">
            Add New Admin
          </h2>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username || ''}
              onChange={onInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={onInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber || ''}
              onChange={onInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
            <div className="h-4 mt-1">
              {passwordError && (
                <p className="text-red-500 text-xs">{passwordError}</p>
              )}
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className={`px-4 py-2 rounded-lg ${
                isValid 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Add Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
