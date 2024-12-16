"use client";

import React from 'react';

// Define the props for the EditAdminModal
interface EditAdminModalProps {
  isOpen: boolean;
  formData: any;
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Edit Admin
          </h2>
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
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
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
  );
}