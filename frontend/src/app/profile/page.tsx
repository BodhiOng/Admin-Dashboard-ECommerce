"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

// Interface for user profile
interface UserProfile {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  profile_picture?: string;
  address?: string;
}

interface ErrorResponse {
  message?: string;
  type?: string;
  details?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string | ErrorResponse;
}

interface AdminUser {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  profile_picture?: string;
  address?: string;
}

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const router = useRouter();
  
  // State for user profile
  const [profile, setProfile] = useState<UserProfile | null>(null);
  // Initial form data state
  const [formData, setFormData] = useState<UserProfile & { 
    phone_number: string;
    address: string;
  }>({
    id: '',
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    address: '',
    profile_picture: ''
  });

  // State for selected profile picture file
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  // Convert base64 image to a valid data URL
  const convertBase64ToImage = (base64String: string | undefined) => {
    if (!base64String) return '/blank-profile-picture-973460_1280.jpg';
    
    // Check if the string is already a valid URL or data URL
    if (base64String.startsWith('http') || base64String.startsWith('data:')) {
      return base64String;
    }

    // If it's a base64 string without a prefix, add the data URL prefix
    return `data:image/jpeg;base64,${base64String}`;
  };

  // State for profile picture URL
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>('/blank-profile-picture-973460_1280.jpg');
  const [selectedFilePreview, setSelectedFilePreview] = useState<string | null>(null);

  // Update profile picture URL when profile changes or file is selected
  useEffect(() => {
    if (selectedFilePreview) {
      setProfilePictureUrl(selectedFilePreview);
    } else if (formData?.profile_picture) {
      setProfilePictureUrl(convertBase64ToImage(formData.profile_picture));
    } else {
      setProfilePictureUrl('/blank-profile-picture-973460_1280.jpg');
    }
  }, [formData?.profile_picture, selectedFilePreview]);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('Fetching profile...');
        setLoading(true);
        const response = await api.get<ApiResponse<UserProfile>>('/auth/me');
        
        if (!response.data.success) {
          console.log('Profile fetch failed:', response.data);
          const error = response.data.error;
          let errorMessage: string;
          
          if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = error.message || error.details || 'Failed to fetch profile';
          } else {
            errorMessage = String(error || 'Failed to fetch profile');
          }
          
          throw new Error(errorMessage);
        }

        console.log('Profile fetch successful');
        const profileData = response.data.data;
        setProfile(profileData);
        setFormData({
          ...profileData,
          phone_number: profileData.phone_number || '',
          address: profileData.address || ''
        });
      } catch (err) {
        console.log('Profile fetch error:', err);
        // Handle Axios error response
        const axiosError = err as { 
          response?: { 
            data?: { 
              error?: { 
                message?: string; 
                details?: string; 
                type?: string 
              } | string;
            }
          } 
        };
        const errorData = axiosError.response?.data?.error;
        console.log('Error data:', errorData);
        let errorMessage = '';

        if (typeof errorData === 'object' && errorData !== null) {
          console.log('Processing object error');
          errorMessage = errorData.message || errorData.details || 'An unexpected error occurred';
        } else if (axiosError.response?.data?.error) {
          console.log('Processing string error from response');
          errorMessage = String(axiosError.response.data.error);
        } else if (err instanceof Error) {
          console.log('Processing Error instance');
          errorMessage = err.message;
        } else {
          console.log('Fallback error case');
          errorMessage = 'An unexpected error occurred';
        }

        console.log('Final error message:', errorMessage);
        const lowerErrorMessage = errorMessage.toLowerCase();
        console.log('Checking error type with:', lowerErrorMessage);
        
        if (
          lowerErrorMessage.includes('password') || 
          lowerErrorMessage.includes('unauthorized') || 
          lowerErrorMessage.includes('invalid') ||
          (typeof errorData === 'object' && errorData?.type === 'AuthenticationError')
        ) {
          console.log('Handling as password error');
          // Handle password-specific errors
          setPasswordErrors(prev => ({
            ...prev,
            currentPassword: 'Current password is incorrect'
          }));
          // Clear password fields for security
          setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
          });
          // Clear global error to prevent refresh loop
          setError('');
        } else {
          console.log('Setting global error:', errorMessage);
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  // Handle password input changes
  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear password errors when typing
    setPasswordErrors(prev => ({
      ...prev,
      [name]: ''
    }));
    setError('');
  };

  // Handle form cancellation
  const handleCancel = () => {
    if (profile) {
      setFormData({
        ...profile,
        phone_number: profile.phone_number || '',
        address: profile.address || ''
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      setSelectedFile(null);
    }
    setError('');
    setSuccess('');
  };

  // Handle profile picture selection
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    // Create preview and update state
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelectedFilePreview(reader.result);
        setSelectedFile(file);
        setError('');
      }
    };
    reader.onerror = () => {
      setError('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  // Clear selected profile picture
  const handleClearProfilePicture = () => {
    setSelectedFile(null);
    setSelectedFilePreview(null);
    setProfilePictureUrl(convertBase64ToImage(profile?.profile_picture));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log('Submitting form...');
      setLoading(true);
      setError('');
      // Clear all password errors at the start of submission
      setPasswordErrors({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });

      // Create update payload with only changed fields
      const updatePayload: Partial<AdminUser> & { 
        currentPassword?: string;
        newPassword?: string;
        first_name?: string;
        last_name?: string;
        username?: string;
        phone_number?: string;
        address?: string;
        profile_picture?: string;
      } = {};

      // Compare with original profile data and use backend field names
      if (formData.first_name !== profile?.first_name) updatePayload.first_name = formData.first_name;
      if (formData.last_name !== profile?.last_name) updatePayload.last_name = formData.last_name;
      if (formData.phone_number !== profile?.phone_number) updatePayload.phone_number = formData.phone_number;
      if (formData.address !== profile?.address) updatePayload.address = formData.address;
      if (formData.username !== profile?.username) updatePayload.username = formData.username;

      // Convert profile picture to base64 if selected and different from current
      if (selectedFile && selectedFilePreview) {
        try {
          // Only update if different from current profile picture
          if (selectedFilePreview !== convertBase64ToImage(profile?.profile_picture)) {
            updatePayload.profile_picture = selectedFilePreview;
          }
        } catch (error) {
          setError('Failed to process image. Please try again.');
          setLoading(false);
          return;
        }
      }

      // Only include password fields if new password is provided
      if (passwordData.newPassword) {
        let hasPasswordErrors = false;
        
        if (!passwordData.currentPassword) {
          setPasswordErrors(prev => ({
            ...prev,
            currentPassword: 'Current password is required to change password'
          }));
          hasPasswordErrors = true;
        } else if (passwordData.currentPassword.length < 8) {
          setPasswordErrors(prev => ({
            ...prev,
            currentPassword: 'Password must be at least 8 characters'
          }));
          hasPasswordErrors = true;
        }

        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
          setPasswordErrors(prev => ({
            ...prev,
            confirmNewPassword: 'New passwords do not match'
          }));
          hasPasswordErrors = true;
        }

        if (passwordData.newPassword.length < 8) {
          setPasswordErrors(prev => ({
            ...prev,
            newPassword: 'New password must be at least 8 characters long'
          }));
          hasPasswordErrors = true;
        }
        
        if (hasPasswordErrors) {
          setLoading(false);
          return;
        }
        
        updatePayload.currentPassword = passwordData.currentPassword;
        updatePayload.newPassword = passwordData.newPassword;
      }

      // Only make API call if there are changes or a profile picture update
      const hasChanges = Object.keys(updatePayload).length > 0 || selectedFile !== null;
      if (!hasChanges) {
        setLoading(false);
        return;
      }

      // If changing password, verify the current password first
      if (passwordData.newPassword) {
        try {
          // Verify current password before proceeding with update
          const verifyResponse = await api.post<ApiResponse<{valid: boolean}>>('/auth/verify-password', {
            password: passwordData.currentPassword
          });
          
          if (!verifyResponse.data.success || !verifyResponse.data.data.valid) {
            setPasswordErrors(prev => ({
              ...prev,
              currentPassword: 'Current password is incorrect'
            }));
            setLoading(false);
            return;
          }
        } catch (err) {
          setPasswordErrors(prev => ({
            ...prev,
            currentPassword: 'Failed to verify current password'
          }));
          setLoading(false);
          return;
        }
      }

      const response = await api.put<ApiResponse<AdminUser>>('/auth/me', updatePayload);

      if (!response.data.success) {
        throw new Error(typeof response.data.error === 'string' 
          ? response.data.error 
          : 'Failed to update profile');
      }

      // Update local profile data
      const updatedProfile = response.data.data;
      setProfile(updatedProfile);
      setFormData({
        ...updatedProfile,
        first_name: updatedProfile.first_name || '',
        last_name: updatedProfile.last_name || '',
        username: updatedProfile.username || '',
        phone_number: updatedProfile.phone_number || '',
        address: updatedProfile.address || ''
      });
      
      // Clear password fields and selected file
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      setSelectedFile(null);

      setSuccess('Profile updated successfully');
    } catch (err) {
      // Handle errors
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      
      // Clear password fields for security if there was an error
      if (passwordData.currentPassword) {
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Display success/error messages
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
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
            
            {/* Profile Picture Upload */}
            <div className="flex items-center mb-4">
              <div className="mr-6 relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleProfilePictureChange}
                  className="hidden" 
                  id="profile-picture-upload"
                />
                <label htmlFor="profile-picture-upload" className="cursor-pointer group">
                  <img 
                    src={profilePictureUrl}
                    alt="Profile Picture" 
                    className="w-24 h-24 rounded-full object-cover group-hover:opacity-50"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-black/20">
                    <span className="text-sm text-white font-medium">{selectedFile ? 'Change' : 'Upload'}</span>
                  </div>
                </label>
                {selectedFile && (
                  <button
                    type="button"
                    onClick={handleClearProfilePicture}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Name Inputs */}
              <div className="grid grid-cols-2 gap-4 flex-grow">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
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
                onChange={handleChange}
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
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number || ''}
                onChange={handleChange}
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
                onChange={handleChange}
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
              ) && !passwordData.currentPassword && !passwordData.newPassword && !passwordData.confirmNewPassword && !selectedFile}
              className={`px-4 py-2 rounded-md transition-colors ${
                Object.keys(profile).every(
                  key => profile[key as keyof UserProfile] === formData[key as keyof UserProfile]
                ) && !passwordData.currentPassword && !passwordData.newPassword && !passwordData.confirmNewPassword && !selectedFile
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
                onChange={handleProfilePictureChange}
                className="hidden" 
                id="profile-picture-upload-mobile"
              />
              <label htmlFor="profile-picture-upload-mobile" className="cursor-pointer group relative">
                <img 
                  src={profilePictureUrl}
                  alt="Profile Picture" 
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
              <h2 className="text-lg font-semibold truncate">{formData.first_name} {formData.last_name}</h2>
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
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
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
                    onChange={handleChange}
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
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number || ''}
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                ) && !passwordData.currentPassword && !passwordData.newPassword && !passwordData.confirmNewPassword && !selectedFile}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  Object.keys(profile).every(
                    key => profile[key as keyof UserProfile] === formData[key as keyof UserProfile]
                  ) && !passwordData.currentPassword && !passwordData.newPassword && !passwordData.confirmNewPassword && !selectedFile
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