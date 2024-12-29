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
      username: value === 'admin' || value === 'superuser',
      email: value === 'admin@example.com' || value === 'superuser@example.com',
      phoneNumber: value === '1234567890' || value === '0987654321'
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
    <div className="h-screen w-screen absolute inset-0 flex items-center justify-center bg-gray-50 overflow-hidden">
      <div className="max-w-md w-full space-y-8 shadow-xl bg-white p-8 rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
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
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
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
              <label htmlFor="phone-number" className="sr-only">
                Phone Number
              </label>
              <input
                id="phone-number"
                name="phone-number"
                type="tel"
                autoComplete="tel"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
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
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
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
        <div className="text-center">
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
