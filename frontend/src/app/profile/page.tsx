"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/axios';

// Interface for user profile
interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  avatar: string;
  address?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  
  // State for user profile
  const [profile, setProfile] = useState<UserProfile | null>(null);
  // State for form data
  const [formData, setFormData] = useState<UserProfile | null>(null);
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  // State for password-related errors
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  // State for form errors
  const [formErrors, setFormErrors] = useState<{
    [key: string]: string;
  }>({});

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get<ApiResponse<UserProfile>>('/auth/me');

        if (response.data.success && response.data.data) {
          setProfile(response.data.data);
          setFormData(response.data.data);
        } else {
          throw new Error(response.data.error || 'Failed to fetch profile');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData) return;

    // Reset previous password errors
    setPasswordErrors({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });

    // Validate password fields if they are filled
    if (passwordData.currentPassword || passwordData.newPassword || passwordData.confirmNewPassword) {
      const passwordValidationErrors: Partial<typeof passwordErrors> = {};

      // Current password validation
      if (!passwordData.currentPassword) {
        passwordValidationErrors.currentPassword = 'Current password is required';
      }

      // New password validation
      if (!passwordData.newPassword) {
        passwordValidationErrors.newPassword = 'New password is required';
      } else if (passwordData.newPassword.length < 8) {
        passwordValidationErrors.newPassword = 'Password must be at least 8 characters long';
      } else if (passwordData.newPassword === passwordData.currentPassword) {
        passwordValidationErrors.newPassword = 'New password cannot be the same as current password';
      }

      // Confirm password validation
      if (!passwordData.confirmNewPassword) {
        passwordValidationErrors.confirmNewPassword = 'Please confirm your new password';
      } else if (passwordData.newPassword !== passwordData.confirmNewPassword) {
        passwordValidationErrors.confirmNewPassword = 'Passwords do not match';
      }

      // If there are password validation errors, set them and stop submission
      if (Object.keys(passwordValidationErrors).length > 0) {
        setPasswordErrors(prevErrors => ({
          ...prevErrors,
          ...passwordValidationErrors
        }));
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      // Update profile
      const profileResponse = await api.put<ApiResponse<UserProfile>>('/auth/profile', {
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        avatar: formData.avatar
      });

      if (!profileResponse.data.success) {
        throw new Error(profileResponse.data.error || 'Failed to update profile');
      }

      // Update password if provided
      if (passwordData.currentPassword && passwordData.newPassword) {
        const passwordResponse = await api.put<ApiResponse<void>>('/auth/password', {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        });

        if (!passwordResponse.data.success) {
          throw new Error(passwordResponse.data.error || 'Failed to update password');
        }
      }

      // Update local state
      setProfile(profileResponse.data.data);
      
      // Reset password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      setPasswordErrors({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes for profile fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? {
      ...prev,
      [name]: value
    } : null);

    // Clear specific error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle password input changes
  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update password data
    setPasswordData(prevData => ({
      ...prevData,
      [name]: value
    }));

    // Clear the specific error for this field
    setPasswordErrors(prevErrors => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  // Handle avatar upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !formData) return;

    try {
      // Create form data
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post<ApiResponse<{ avatarUrl: string }>>('/auth/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setFormData(prev => prev ? {
          ...prev,
          avatar: response.data.data.avatarUrl
        } : null);
      } else {
        throw new Error(response.data.error || 'Failed to upload avatar');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload avatar');
    }
  };

  // Handle form cancellation
  const handleCancel = () => {
    // Reset form data to original profile
    setFormData(profile);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
    setPasswordErrors({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!profile || !formData) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">No profile data available. </strong>
        <span className="block sm:inline">Please try refreshing the page.</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-md:p-0 max-w-2xl mx-auto">
      {/* Desktop View */}
      <div className="hidden md:block">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">User Profile</h1>
        
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          {/* Basic Information Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Basic Information</h2>
            
            {/* Profile Avatar Upload */}
            <div className="flex items-center mb-4">
              <div className="mr-6 relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarChange}
                  className="hidden" 
                  id="avatar-upload"
                />
                <label htmlFor="avatar-upload" className="cursor-pointer group">
                  <img 
                    src={formData.avatar} 
                    alt="Profile Avatar" 
                    className="w-24 h-24 rounded-full object-cover group-hover:opacity-50"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm text-gray-700">Change</span>
                  </div>
                </label>
              </div>

              {/* Name Inputs */}
              <div className="grid grid-cols-2 gap-4 flex-grow">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Username Input */}
            <div className="mt-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
            </div>

            {/* Email Input */}
            <div className="mt-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed"
                readOnly
                disabled
              />
            </div>
          </div>

          {/* Contact Information Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Contact Information</h2>
            
            {/* Phone Number */}
            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
            </div>

            {/* Address */}
            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
            </div>
          </div>

          {/* Password Change Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Password Change</h2>
            <div>
              {/* Current Password */}
              <div className="mb-4">
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
                {passwordErrors.currentPassword && (
                  <p className="text-sm text-red-600">{passwordErrors.currentPassword}</p>
                )}
              </div>

              {/* New Password */}
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
                {passwordErrors.newPassword && (
                  <p className="text-sm text-red-600">{passwordErrors.newPassword}</p>
                )}
              </div>

              {/* Confirm New Password */}
              <div className="mb-4">
                <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  value={passwordData.confirmNewPassword}
                  onChange={handlePasswordInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
                {passwordErrors.confirmNewPassword && (
                  <p className="text-sm text-red-600">{passwordErrors.confirmNewPassword}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={Object.keys(profile).every(
                key => profile[key as keyof UserProfile] === formData[key as keyof UserProfile]
              ) && !passwordData.currentPassword && !passwordData.newPassword && !passwordData.confirmNewPassword}
              className={`px-4 py-2 rounded-md transition-colors ${
                Object.keys(profile).every(
                  key => profile[key as keyof UserProfile] === formData[key as keyof UserProfile]
                ) && !passwordData.currentPassword && !passwordData.newPassword && !passwordData.confirmNewPassword
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <div className="space-y-6">
          {/* Mobile Profile Header */}
          <div className="flex items-center space-x-4 bg-white shadow-md rounded-lg p-4">
            <div className="relative">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleAvatarChange}
                className="hidden" 
                id="avatar-upload-mobile"
              />
              <label htmlFor="avatar-upload-mobile" className="cursor-pointer group relative">
                <img 
                  src={formData.avatar} 
                  alt="Profile Avatar" 
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </label>
            </div>
            <div className="flex-grow overflow-hidden">
              <h2 className="text-lg font-semibold truncate">{formData.firstName} {formData.lastName}</h2>
              <p className="text-gray-500 text-sm truncate">@{formData.username}</p>
            </div>
          </div>

          {/* Mobile Form Sections */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-base font-semibold text-gray-700 mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed"
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-base font-semibold text-gray-700 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password Change Section */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-base font-semibold text-gray-700 mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                  {passwordErrors.currentPassword && (
                    <p className="text-sm text-red-600 mt-1">{passwordErrors.currentPassword}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-sm text-red-600 mt-1">{passwordErrors.newPassword}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    value={passwordData.confirmNewPassword}
                    onChange={handlePasswordInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                  {passwordErrors.confirmNewPassword && (
                    <p className="text-sm text-red-600 mt-1">{passwordErrors.confirmNewPassword}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Action Buttons */}
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={Object.keys(profile).every(
                  key => profile[key as keyof UserProfile] === formData[key as keyof UserProfile]
                ) && !passwordData.currentPassword && !passwordData.newPassword && !passwordData.confirmNewPassword}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  Object.keys(profile).every(
                    key => profile[key as keyof UserProfile] === formData[key as keyof UserProfile]
                  ) && !passwordData.currentPassword && !passwordData.newPassword && !passwordData.confirmNewPassword
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}