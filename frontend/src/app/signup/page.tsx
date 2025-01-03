'use client';

import React, { useState, useCallback, useEffect } from 'react';
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

  // Check field availability (temporary implementation)
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
        setUsernameError(mockData.username ? 'Username is already taken' : '');
        break;
      case 'email':
        setEmailTaken(mockData.email);
        setEmailError(mockData.email ? 'Email is already registered' : '');
        break;
      case 'phoneNumber':
        setPhoneNumberTaken(mockData.phoneNumber);
        setPhoneNumberError(mockData.phoneNumber ? 'Phone number is already registered' : '');
        break;
    }
  }, []);

  // Validate fields on change
  useEffect(() => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
      checkFieldAvailability('email', email);
    }

    // Username validation
    if (username && username.length < 3) {
      setUsernameError('Username must be at least 3 characters long');
    } else {
      setUsernameError('');
      checkFieldAvailability('username', username);
    }

    // Phone number availability check only
    if (phoneNumber) {
      checkFieldAvailability('phoneNumber', phoneNumber);
    }

    // Password validation
    if (password && password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
    } else {
      setPasswordError('');
    }

    // Confirm password validation
    if (confirmPassword && password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  }, [email, username, phoneNumber, password, confirmPassword, checkFieldAvailability]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if there are any errors or taken fields
    if (
      emailError || usernameError || phoneNumberError || 
      passwordError || confirmPasswordError ||
      emailTaken || usernameTaken || phoneNumberTaken
    ) {
      return;
    }

    try {
      // TODO: Replace with actual signup logic
      if (email && password && username && phoneNumber) {
        // Simulate successful signup
        router.push('/login');
      }
    } catch (err) {
      // Handle signup error
      console.error('Signup error:', err);
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
          <form className="mt-8 space-y-6" onSubmit={handleSignup}>
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
                <div className="h-4 mt-1">
                  {emailError && (
                    <p className="text-red-500 text-xs">{emailError}</p>
                  )}
                </div>
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
                <div className="h-4 mt-1">
                  {usernameError && (
                    <p className="text-red-500 text-xs">{usernameError}</p>
                  )}
                </div>
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
                <div className="h-4 mt-1">
                  {phoneNumberError && (
                    <p className="text-red-500 text-xs">{phoneNumberError}</p>
                  )}
                </div>
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
                <div className="h-4 mt-1">
                  {passwordError && (
                    <p className="text-red-500 text-xs">{passwordError}</p>
                  )}
                </div>
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
                <div className="h-4 mt-1">
                  {confirmPasswordError && (
                    <p className="text-red-500 text-xs">{confirmPasswordError}</p>
                  )}
                </div>
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
      <div className="md:hidden fixed inset-0 bg-white overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Create your account
          </h2>
          <form className="space-y-6" onSubmit={handleSignup}>
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
                <div className="h-4 mt-1">
                  {emailError && (
                    <p className="text-red-500 text-xs">{emailError}</p>
                  )}
                </div>
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
                <div className="h-4 mt-1">
                  {usernameError && (
                    <p className="text-red-500 text-xs">{usernameError}</p>
                  )}
                </div>
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
                <div className="h-4 mt-1">
                  {phoneNumberError && (
                    <p className="text-red-500 text-xs">{phoneNumberError}</p>
                  )}
                </div>
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
                <div className="h-4 mt-1">
                  {passwordError && (
                    <p className="text-red-500 text-xs">{passwordError}</p>
                  )}
                </div>
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
                <div className="h-4 mt-1">
                  {confirmPasswordError && (
                    <p className="text-red-500 text-xs">{confirmPasswordError}</p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign up
                </button>
              </div>
            </div>
          </form>

          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white">
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
