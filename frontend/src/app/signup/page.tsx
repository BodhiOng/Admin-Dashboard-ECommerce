'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // New state for individual errors and availability
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // New state for field availability
  const [emailTaken, setEmailTaken] = useState(false);
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [phoneNumberTaken, setPhoneNumberTaken] = useState(false);

  const router = useRouter();

  // Handle form submission with comprehensive validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset all previous errors
    setEmailError('');
    setUsernameError('');
    setPhoneNumberError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setUsernameTaken(false);
    setEmailTaken(false);
    setPhoneNumberTaken(false);

    // Validation object to track all validation errors
    const validationErrors: {
      email?: string;
      username?: string;
      phoneNumber?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      validationErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      validationErrors.email = 'Please enter a valid email address';
    }

    // Username validation
    if (!username) {
      validationErrors.username = 'Username is required';
    } else if (username.length < 3) {
      validationErrors.username = 'Username must be at least 3 characters long';
    }

    // Phone number validation (optional)
    if (phoneNumber && phoneNumber.length < 10) {
      validationErrors.phoneNumber = 'Please enter a valid phone number';
    }

    // Password validation
    if (!password) {
      validationErrors.password = 'Password is required';
    } else if (password.length < 8) {
      validationErrors.password = 'Password must be at least 8 characters long';
    }

    // Confirm password validation
    if (!confirmPassword) {
      validationErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }

    // Field availability checks (simulated backend validation)
    // Temporary hardcoded values for testing
    if (Object.keys(validationErrors).length === 0) {
      // Simulate backend availability checks
      if (username === 'admin') {
        validationErrors.username = 'Username is already taken';
        setUsernameTaken(true);
      }

      if (email === 'admin@example.com') {
        validationErrors.email = 'Email is already registered';
        setEmailTaken(true);
      }

      if (phoneNumber === '1234567890') {
        validationErrors.phoneNumber = 'Phone number is already registered';
        setPhoneNumberTaken(true);
      }
    }

    // If there are any validation errors, set them and stop submission
    if (Object.keys(validationErrors).length > 0) {
      // Set individual error states
      setEmailError(validationErrors.email || '');
      setUsernameError(validationErrors.username || '');
      setPhoneNumberError(validationErrors.phoneNumber || '');
      setPasswordError(validationErrors.password || '');
      setConfirmPasswordError(validationErrors.confirmPassword || '');
      
      return; // Stop form submission
    }

    // If all validations pass, proceed with form submission
    try {
      // Actual signup logic here
      if (email && password && username && phoneNumber) {
        // Simulate successful signup
        router.push('/login');
      }
    } catch (error) {
      console.error('Signup failed', error);
    }
  };

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:flex h-screen w-screen absolute inset-0 items-center justify-center bg-gray-50 overflow-hidden">
        <div className="max-w-md w-full space-y-8 shadow-xl bg-white p-8 rounded-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              Create your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && (
                  <p className="text-red-500 text-xs">{emailError}</p>
                )}
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {usernameError && (
                  <p className="text-red-500 text-xs">{usernameError}</p>
                )}
              </div>
              <div>
                <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  id="phone-number"
                  name="phone-number"
                  type="tel"
                  autoComplete="tel"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="+60 123 456 789"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                {phoneNumberError && (
                  <p className="text-red-500 text-xs">{phoneNumberError}</p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {passwordError && (
                  <p className="text-red-500 text-xs">{passwordError}</p>
                )}
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {confirmPasswordError && (
                  <p className="text-red-500 text-xs">{confirmPasswordError}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign up
              </button>
            </div>
          </form>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden fixed inset-0 bg-white overflow-y-auto flex items-center justify-center">
        <div className="p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Create your account
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email-address-mobile" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email-address-mobile"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && (
                  <p className="text-red-500 text-xs">{emailError}</p>
                )}
              </div>

              <div>
                <label htmlFor="username-mobile" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  id="username-mobile"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {usernameError && (
                  <p className="text-red-500 text-xs">{usernameError}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone-number-mobile" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  id="phone-number-mobile"
                  name="phone-number"
                  type="tel"
                  autoComplete="tel"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="+60 123 456 789"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                {phoneNumberError && (
                  <p className="text-red-500 text-xs">{phoneNumberError}</p>
                )}
              </div>

              <div>
                <label htmlFor="password-mobile" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password-mobile"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {passwordError && (
                  <p className="text-red-500 text-xs">{passwordError}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirm-password-mobile" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirm-password-mobile"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {confirmPasswordError && (
                  <p className="text-red-500 text-xs">{confirmPasswordError}</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 mt-4 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign up
                </button>
              </div>
            </div>
          </form>
          <div className="p-4 mt-auto">
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
