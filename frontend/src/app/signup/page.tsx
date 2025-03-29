'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import debounce from 'lodash.debounce';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

interface ValidationResponse {
  isAvailable: boolean;
  message?: string;
}

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // State for individual errors and availability
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const validateField = async (field: string, value: string) => {
    try {
      const response = await api.post('/auth/validate-field', {
        field,
        value
      });
      return response.data.success;
    } catch (error) {
      return true; // Consider valid if validation fails
    }
  };

  const validateEmail = useCallback(
    debounce(async (email: string) => {
      if (email && email.length > 0) {
        const isValid = await validateField('email', email);
        if (!isValid) {
          setEmailError('Email already registered');
        } else {
          setEmailError('');
        }
      }
    }, 500),
    []
  );

  const validateUsername = useCallback(
    debounce(async (username: string) => {
      if (username && username.length > 0) {
        const isValid = await validateField('username', username);
        if (!isValid) {
          setUsernameError('Username already taken');
        } else {
          setUsernameError('');
        }
      }
    }, 500),
    []
  );

  const validatePhoneNumber = useCallback(
    debounce(async (phoneNumber: string) => {
      if (phoneNumber && phoneNumber.length > 0) {
        const isValid = await validateField('phone_number', phoneNumber);
        if (!isValid) {
          setPhoneNumberError('Phone number already registered');
        } else {
          setPhoneNumberError('');
        }
      }
    }, 500),
    []
  );

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    validateUsername(value);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    validatePhoneNumber(value);
  };

  // Handle form submission with comprehensive validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset all previous errors
    setEmailError('');
    setUsernameError('');
    setPhoneNumberError('');
    setPasswordError('');
    setConfirmPasswordError('');

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

    // If there are any validation errors, set them and stop submission
    if (Object.keys(validationErrors).length > 0) {
      // Set individual error states
      setEmailError(validationErrors.email || '');
      setUsernameError(validationErrors.username || '');
      setPhoneNumberError(validationErrors.phoneNumber || '');
      setPasswordError(validationErrors.password || '');
      setConfirmPasswordError(validationErrors.confirmPassword || '');
      return;
    }

    // If all validations pass, proceed with form submission
    try {
      setLoading(true);

      const response = await api.post<ApiResponse<{ user: any; token: string }>>('/auth/register', {
        email,
        username,
        password,
        firstName,
        lastName,
        phoneNumber
      });

      if (response.data.success) {
        // Registration successful, redirect to pending approval
        router.push('/pending-approval');
      }
    } catch (err: any) {
      // Clear any previous errors
      setEmailError('');
      setUsernameError('');
      setPhoneNumberError('');

      const error = err.response?.data?.error;
      if (error?.type === 'ValidationError' && error.errors) {
        // Set specific field errors if they exist
        if (error.errors.email) setEmailError(error.errors.email);
        if (error.errors.username) setUsernameError(error.errors.username);
        if (error.errors.phoneNumber) setPhoneNumberError(error.errors.phoneNumber);
      } else {
        // Handle general error
        const errorMessage = error?.message || 'Registration failed';
        setEmailError(errorMessage);
      }
    } finally {
      setLoading(false);
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
              {/* Email */}
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
                  placeholder="Enter your email address"
                  value={email}
                  onChange={handleEmailChange}
                />
                {emailError && (
                  <p className="text-red-500 text-xs">{emailError}</p>
                )}
              </div>

              {/* Username */}
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
                  placeholder="Choose a unique username"
                  value={username}
                  onChange={handleUsernameChange}
                />
                {usernameError && (
                  <p className="text-red-500 text-xs">{usernameError}</p>
                )}
              </div>

              {/* First Name */}
              <div>
                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  id="first-name"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  id="last-name"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              {/* Phone Number */}
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
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                />
                {phoneNumberError && (
                  <p className="text-red-500 text-xs">{phoneNumberError}</p>
                )}
              </div>

              {/* Password */}
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
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {passwordError && (
                  <p className="text-red-500 text-xs">{passwordError}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {confirmPasswordError && (
                  <p className="text-red-500 text-xs">{confirmPasswordError}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign in
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden h-screen w-screen absolute inset-0 bg-gray-50 flex flex-col">
        <div className="flex-grow flex flex-col justify-center px-4 py-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
              Create your account
            </h2>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="py-8 px-4 sm:rounded-lg sm:px-10">
              {/* Same form content as desktop view */}
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Email */}
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
                    placeholder="Enter your email address"
                    value={email}
                    onChange={handleEmailChange}
                  />
                  {emailError && (
                    <p className="text-red-500 text-xs">{emailError}</p>
                  )}
                </div>

                {/* Username */}
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
                    placeholder="Choose a unique username"
                    value={username}
                    onChange={handleUsernameChange}
                  />
                  {usernameError && (
                    <p className="text-red-500 text-xs">{usernameError}</p>
                  )}
                </div>

                {/* First Name */}
                <div>
                  <label htmlFor="first-name-mobile" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    id="first-name-mobile"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="last-name-mobile" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    id="last-name-mobile"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                {/* Phone Number */}
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
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                  />
                  {phoneNumberError && (
                    <p className="text-red-500 text-xs">{phoneNumberError}</p>
                  )}
                </div>

                {/* Password */}
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
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {passwordError && (
                    <p className="text-red-500 text-xs">{passwordError}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirm-password-mobile" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password-mobile"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {confirmPasswordError && (
                    <p className="text-red-500 text-xs">{confirmPasswordError}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 mt-4 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  >
                    {loading ? 'Creating account...' : 'Create account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
