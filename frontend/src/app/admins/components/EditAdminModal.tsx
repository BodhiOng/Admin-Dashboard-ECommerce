"use client";

import React, { useState, useEffect } from 'react';

// Define the props for the EditAdminModal
interface EditAdminModalProps {
  isOpen: boolean;
  formData: {
    username: string;
    email: string;
    phoneNumber: string;
    role: 'Current Admin' | 'Admin Applicant';
  };
  onClose: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function EditAdminModal({
  isOpen,
  formData,
  onClose,
  onInputChange,
  onSubmit
}: EditAdminModalProps) {
  // State to manage exit animation
  const [isClosing, setIsClosing] = useState(false);

  // Handle close with animation
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
      {/* Desktop View - Hidden on mobile screens */}
      <div className="hidden md:fixed md:inset-0 md:bg-black md:bg-opacity-50 md:flex md:items-center md:justify-center md:z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
          <div className="p-6 border-b relative">
            <h2 className="text-xl font-semibold text-gray-800">
              Edit Admin
            </h2>
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <form className="p-6 space-y-4" onSubmit={onSubmit}>
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
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber || ''}
                onChange={onInputChange}
                required
                placeholder="+1 (555) 123-4567"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                name="role"
                value={formData.role || ''}
                onChange={onInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="Current Admin">Current Admin</option>
                <option value="Admin Applicant">Admin Applicant</option>
              </select>
              <p className="mt-2 text-xs text-gray-500">
                Only Current Admins can promote Admin Applicants.
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Update Admin
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
              <h2 className="text-lg font-semibold text-gray-800 text-center">Edit Admin</h2>
            </div>
            <form className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-100px)] pb-20" onSubmit={onSubmit}>
              <div>
                <label className="block text-xs font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username || ''}
                  onChange={onInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber || ''}
                  onChange={onInputChange}
                  required
                  placeholder="+1 (555) 123-4567"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">Role</label>
                <select
                  name="role"
                  value={formData.role || ''}
                  onChange={onInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option value="Current Admin">Current Admin</option>
                  <option value="Admin Applicant">Admin Applicant</option>
                </select>
                <p className="mt-2 text-xs text-gray-500">
                  Only Current Admins can promote Admin Applicants.
                </p>
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
                  type="submit"
                  onClick={onSubmit}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md"
                >
                  Update Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}