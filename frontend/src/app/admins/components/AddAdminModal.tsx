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

  // State to manage exit animation
  const [isClosing, setIsClosing] = useState(false);

  // Check if fields are taken (temporary implementation)
  const checkFieldAvailability = useCallback(async (field: string, value: string) => {
    // Temporary hardcoded values for testing
    const mockData = {
      username: value === 'admin',
      email: value === 'admin@example.com',
      phoneNumber: value === '1234567890'
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

  // Reset password fields when modal opens
  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setConfirmPassword('');
    }
  }, [isOpen]);

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
            <form className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-100px)] pb-20">
              {/* Username */}
              <div>
                <label className="block text-xs font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
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

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
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

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
                <div className="h-4 mt-1">
                  {phoneNumberTaken && (
                    <p className="text-red-500 text-xs">
                      Phone number is already registered
                    </p>
                  )}
                </div>
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
                <div className="h-4 mt-1">
                  {password && password.length < 8 && (
                    <p className="text-red-500 text-xs">Password must be at least 8 characters long</p>
                  )}
                </div>
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
                <div className="h-4 mt-1">
                  {!passwordsMatch && confirmPassword && (
                    <p className="text-red-500 text-xs">Passwords do not match</p>
                  )}
                </div>
              </div>

              {/* Spacer to ensure buttons don't cover content */}
              <div className="h-20"></div>
            </form>

            {/* Submit Buttons - Fixed at bottom */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isValid}
                  className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-md 
                    ${isValid 
                      ? 'bg-indigo-600 hover:bg-indigo-700' 
                      : 'bg-gray-400 cursor-not-allowed'
                    }`}
                >
                  Add Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
