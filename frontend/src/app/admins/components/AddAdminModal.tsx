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
  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    email?: string;
    phone_number?: string;
  }>({});
  const [isClosing, setIsClosing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if fields are taken
  const checkFieldAvailability = async (formData: any) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admins/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          phone_number: formData.phone_number
        })
      });

      if (!response.ok) {
        throw new Error('Validation failed');
      }

      const result = await response.json();
      return result.errors || {};
    } catch (error) {
      console.error('Validation error:', error);
      return {};
    }
  };

  // Memoize the password validation
  const passwordsMatch = useMemo(() => {
    return password === confirmPassword;
  }, [password, confirmPassword]);

  // Update useEffect to only check basic validations
  useEffect(() => {
    const errors: typeof validationErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    // Username validation
    if (formData.username && formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters long';
    }

    // Password validation
    const isPasswordValid = password.trim() !== '' && 
                          confirmPassword.trim() !== '' && 
                          passwordsMatch &&
                          password.length >= 8;

    const formIsValid = formData.username?.trim() !== '' &&
                       formData.email?.trim() !== '' &&
                       formData.phone_number?.trim() !== '' &&
                       isPasswordValid &&
                       Object.keys(errors).length === 0;
    
    setValidationErrors(errors);
    setIsValid(formIsValid);
  }, [password, confirmPassword, passwordsMatch, formData]);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const handleConfirmPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      // Check for duplicates before submitting
      const validationErrors = await checkFieldAvailability(formData);
      
      if (Object.keys(validationErrors).length > 0) {
        setValidationErrors(validationErrors);
        return;
      }

      // Explicitly add password to formData before submission
      const updatedFormData = {
        ...formData,
        password: password
      };
      
      // Submit the form
      await onSubmit(updatedFormData);
      handleClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modified close handler to trigger animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:fixed md:inset-0 md:bg-black md:bg-opacity-50 md:flex md:items-center md:justify-center md:z-50">
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
              {validationErrors.username && (
                <p className="text-red-500 text-xs">
                  {validationErrors.username}
                </p>
              )}
              {formData.username && formData.username.length < 3 && (
                <p className="text-red-500 text-xs">
                  Username must be at least 3 characters long
                </p>
              )}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={onInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {validationErrors.email && (
                <p className="text-red-500 text-xs">
                  {validationErrors.email}
                </p>
              )}
              {formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                <p className="text-red-500 text-xs">
                  Please enter a valid email address
                </p>
              )}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number || ''}
                onChange={onInputChange}
                required

                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {validationErrors.phone_number && (
                <p className="text-red-500 text-xs">
                  {validationErrors.phone_number}
                </p>
              )}
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
              {password && password.length < 8 && (
                <p className="text-red-500 text-xs">Password must be at least 8 characters long</p>
              )}
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
              {!passwordsMatch && confirmPassword && (
                <p className="text-red-500 text-xs">Passwords do not match</p>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleClose}
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

      {/* Mobile View - Full Screen */}
      {isOpen && (
        <div 
          className={`
            md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 
            ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}
            flex items-end sm:items-center justify-center
          `}
        >
          <div 
            className={`
              w-full bg-white rounded-t-xl sm:rounded-lg 
              ${isClosing ? 'animate-slide-down' : 'animate-slide-up'}
              sm:max-w-lg 
              max-h-[90vh]
              overflow-hidden
            `}
          >
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800 text-center">Add New Admin</h2>
            </div>
            <form className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-100px)] pb-20" onSubmit={handleSubmit}>
              {/* Username */}
              <div>
                <label className="block text-xs font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username || ''}
                  onChange={onInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
                {validationErrors.username && (
                  <p className="text-red-500 text-xs">
                    {validationErrors.username}
                  </p>
                )}
                {formData.username && formData.username.length < 3 && (
                  <p className="text-red-500 text-xs">
                    Username must be at least 3 characters long
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={onInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
                {validationErrors.email && (
                  <p className="text-red-500 text-xs">
                    {validationErrors.email}
                  </p>
                )}
                {formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                  <p className="text-red-500 text-xs">
                    Please enter a valid email address
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number || ''}
                  onChange={onInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
                {validationErrors.phone_number && (
                  <p className="text-red-500 text-xs">
                    {validationErrors.phone_number}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
                {password && password.length < 8 && (
                  <p className="text-red-500 text-xs">Password must be at least 8 characters long</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
                {!passwordsMatch && confirmPassword && (
                  <p className="text-red-500 text-xs">Passwords do not match</p>
                )}
              </div>

              {/* Spacer to ensure buttons don't cover content */}
              <div className="h-20"></div>

              {/* Submit Buttons - Fixed at bottom */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!isValid}
                    className={`flex-1 px-4 py-2 rounded ${
                      isValid 
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    }`}
                  >
                    Add Admin
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
