"use client";

import React, { useState, useCallback, useEffect, useMemo } from 'react';

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
  const [isValid, setIsValid] = useState(false);

  // New state for taken checks
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);
  const [phoneNumberTaken, setPhoneNumberTaken] = useState(false);

  // Check if fields are taken (temporary implementation)
  const checkFieldAvailability = useCallback(async (field: string, value: string) => {
    // Temporary hardcoded values for testing
    const mockData = {
      username: value === 'admin' || value === 'superuser',
      email: value === 'admin@example.com' || value === 'superuser@example.com',
      phoneNumber: value === '1234567890' || value === '0987654321'
    };

    switch(field) {
      case 'username':
        setUsernameTaken(mockData.username);
        break;
      case 'email':
        setEmailTaken(mockData.email);
        break;
      case 'phoneNumber':
        setPhoneNumberTaken(mockData.phoneNumber);
        break;
    }
  }, []);

  // Modify onInputChange to check availability
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onInputChange(e);

    // Check availability for specific fields
    if (['username', 'email', 'phoneNumber'].includes(name)) {
      checkFieldAvailability(name, value);
    }
  };

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const handleConfirmPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  }, []);

  // Memoize the password validation
  const passwordsMatch = useMemo(() => {
    return password === confirmPassword;
  }, [password, confirmPassword]);

  // Update useEffect to include taken checks in validation
  useEffect(() => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      // Email format validation
      setEmailTaken(false);
    } else {
      // Check availability if email is valid
      checkFieldAvailability('email', formData.email);
    }

    // Username validation
    if (formData.username && formData.username.length < 3) {
      // Username length validation
      setUsernameTaken(false);
    } else {
      // Check availability if username is valid
      checkFieldAvailability('username', formData.username);
    }

    // Check availability for phone number
    checkFieldAvailability('phoneNumber', formData.phoneNumber);

    const isPasswordValid = password.trim() !== '' && 
                          confirmPassword.trim() !== '' && 
                          passwordsMatch &&
                          password.length >= 8;

    const formIsValid = formData.username?.trim() !== '' &&
                       formData.email?.trim() !== '' &&
                       formData.phoneNumber?.trim() !== '' &&
                       isPasswordValid &&
                       !usernameTaken &&
                       !emailTaken &&
                       !phoneNumberTaken;
    
    setIsValid(formIsValid);
  }, [password, confirmPassword, passwordsMatch, formData, 
      usernameTaken, emailTaken, phoneNumberTaken, checkFieldAvailability]);

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
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <div className="h-4 mt-1">
              {usernameTaken && (
                <p className="text-red-500 text-xs">
                  Username is already taken
                </p>
              )}
              {formData.username && formData.username.length < 3 && (
                <p className="text-red-500 text-xs">
                  Username must be at least 3 characters long
                </p>
              )}
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <div className="h-4 mt-1">
              {emailTaken && (
                <p className="text-red-500 text-xs">
                  Email is already registered
                </p>
              )}
              {formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                <p className="text-red-500 text-xs">
                  Please enter a valid email address
                </p>
              )}
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber || ''}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <div className="h-4 mt-1">
              {phoneNumberTaken && (
                <p className="text-red-500 text-xs">
                  Phone number is already registered
                </p>
              )}
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <div className="h-4 mt-1">
              {password && password.length < 8 && (
                <p className="text-red-500 text-xs">Password must be at least 8 characters long</p>
              )}
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <div className="h-4 mt-1">
              {!passwordsMatch && confirmPassword && (
                <p className="text-red-500 text-xs">Passwords do not match</p>
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className={`px-4 py-2 rounded ${
                isValid 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
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
