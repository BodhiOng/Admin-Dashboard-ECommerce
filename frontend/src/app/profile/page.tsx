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
  email: 'bodhiong@example.com',
  firstName: 'Bodhi',
  lastName: 'Ong',
  phoneNumber: '+603515156156',
  avatar: '/default-avatar.png',
  address: 'Bukit Jalil'
};

export default function Profile() {
  // State for user profile
  const [profile, setProfile] = useState<UserProfile>(initialUserProfile);
  
  // State for form data
  const [formData, setFormData] = useState<UserProfile>(initialUserProfile);

  // Handle form cancellation
  const handleCancel = () => {
    // Reset form data to original profile
    setFormData(profile);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validate form data
    const updatedProfile = { ...formData };
    
    // Perform any validation here
    if (!updatedProfile.firstName || !updatedProfile.lastName || !updatedProfile.username) {
      alert('First Name, Last Name, and Username are required');
      return;
    }

    // Update profile
    setProfile(updatedProfile);
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
              placeholder="Optional"
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
              placeholder="Optional"
            />
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
            )}
            className={`px-4 py-2 rounded-md transition-colors ${
              Object.keys(profile).every(
                key => profile[key as keyof UserProfile] === formData[key as keyof UserProfile]
              )
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