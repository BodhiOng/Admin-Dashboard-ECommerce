"use client";

import React, { useState } from 'react';

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

// Mock initial user profile data
const initialUserProfile: UserProfile = {
  id: 'USR-0001',
  username: 'bodhiong',
  email: 'bodhiong@gmail.com',
  firstName: 'Bodhi',
  lastName: 'Ong',
  phoneNumber: '+603515156156',
  avatar: '/default-avatar.png',
  address: 'Bukit Jalil'
};

export default function ProfilePage() {
  // State for user profile
  const [profile, setProfile] = useState<UserProfile>(initialUserProfile);
  
  // State for form data
  const [formData, setFormData] = useState<UserProfile>(initialUserProfile);

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

  // Validate entire form including password
  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    // Password validation (only if password fields are filled)
    if (passwordData.currentPassword || passwordData.newPassword || passwordData.confirmNewPassword) {
      // Current password validation
      if (!passwordData.currentPassword) {
        errors.currentPassword = 'Current password is required';
      }

      // New password validation
      if (!passwordData.newPassword) {
        errors.newPassword = 'New password is required';
      } else {
        // Password length check
        if (passwordData.newPassword.length < 8) {
          errors.newPassword = 'Password must be at least 8 characters long';
        }
      }

      // Confirm password validation
      if (!passwordData.confirmNewPassword) {
        errors.confirmNewPassword = 'Please confirm your new password';
      } else if (passwordData.newPassword !== passwordData.confirmNewPassword) {
        errors.confirmNewPassword = 'Passwords do not match';
      }
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Prepare update payload
    const updatePayload = {
      ...formData,
      // Only include password fields if they are filled
      ...(passwordData.currentPassword && passwordData.newPassword ? {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      } : {})
    };

    // TODO: Implement actual profile and password update logic
    console.log('Profile update submitted', updatePayload);

    // Reset form and password fields
    setProfile(formData);
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

  // Handle input changes for profile fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

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
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));

    // Perform real-time validation
    let errorMessage = '';
    switch (name) {
      case 'currentPassword':
        // Validate current password as user types
        if (!value) {
          errorMessage = 'Current password is required';
        } 
        // TODO: Implement backend password verification
        // This should be replaced with an actual API call to verify the current password
        break;
      
      case 'newPassword':
        // Validate new password
        if (!value) {
          errorMessage = 'New password is required';
        } else if (value.length < 8) {
          errorMessage = 'Password must be at least 8 characters long';
        }
        break;
      
      case 'confirmNewPassword':
        // Validate confirm password
        if (!value) {
          errorMessage = 'Please confirm your new password';
        } else if (value !== passwordData.newPassword) {
          errorMessage = 'Passwords do not match';
        }
        break;
    }

    // Update specific error
    setPasswordErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
  };

  // Handle avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          avatar: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
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
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
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
  );
}