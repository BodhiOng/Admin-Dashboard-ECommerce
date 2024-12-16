"use client";

import React, { useState } from 'react';
import AddAdminModal from './components/AddAdminModal';
import EditAdminModal from './components/EditAdminModal';

// Mock initial admin data
const mockAdmins = [
    {
        id: 'ADM-0001',
        username: 'johndoe',
        email: 'john.doe@gmail.com',
        phoneNumber: '+6011351561561',
        role: 'Admin'
    },
    {
        id: 'ADM-0002',
        username: 'janesmith',
        email: 'jane.smith@gmail.com',
        phoneNumber: '+6056153156161',
        role: 'Admin'
    }
];

// Admin interface for type safety
interface Admin {
    id: string;
    username: string;
    email: string;
    phoneNumber: string;
    role: string;
    password?: string;
}

export default function AdminsPage() {
    const [admins, setAdmins] = useState<Admin[]>(mockAdmins);
    const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [formData, setFormData] = useState<Admin>({
        id: '',
        username: '',
        email: '',
        phoneNumber: '',
        role: 'Admin',
        password: ''
    });

    // Search and Pagination states
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    // Create new admin
    const handleCreateAdmin = (formData: Admin) => {
        // Validate form data
        const trimmedData = {
            username: formData.username?.trim(),
            email: formData.email?.trim(),
            phoneNumber: formData.phoneNumber?.trim(),
            password: formData.password?.trim()
        };

        // Check if all required fields are filled
        if (!trimmedData.username || !trimmedData.email || 
            !trimmedData.phoneNumber || !trimmedData.password) {
            console.error('All fields are required', trimmedData);
            return;
        }

        const admin: Admin = {
            ...formData,
            id: `ADM-${String(admins.length + 1).padStart(4, '0')}`,
            role: 'Admin'
        };
        
        // Add new admin to the list
        setAdmins(prevAdmins => [...prevAdmins, admin]);
        
        // Reset form and close modal
        setFormData({
            id: '',
            username: '',
            email: '',
            phoneNumber: '',
            role: 'Admin',
            password: ''
        });
        setIsAddModalOpen(false);
    };

    // Update existing admin
    const handleUpdateAdmin = () => {
        if (!selectedAdmin || !formData.username || !formData.phoneNumber) return;

        setAdmins(admins.map(admin =>
            admin.id === selectedAdmin.id
                ? {
                    ...admin,
                    username: formData.username,
                    phoneNumber: formData.phoneNumber,
                    role: 'Admin'
                }
                : admin
        ));
        setIsEditModalOpen(false);
        // Reset form data
        setFormData({
            id: '',
            username: '',
            email: '',
            phoneNumber: '',
            role: 'Admin',
            password: ''
        });
    };

    // Delete admin
    const handleDeleteAdmin = (adminId: string) => {
        setAdmins(admins.filter(admin => admin.id !== adminId));
    };

    // Open modal for adding new admin
    const openAddModal = () => {
        setSelectedAdmin(null);
        // Reset form data for add modal
        setFormData({
            id: '',
            username: '',
            email: '',
            phoneNumber: '',
            role: 'Admin',
            password: ''
        });
        setIsAddModalOpen(true);
    };

    // Open modal for editing existing admin
    const openEditModal = (admin: Admin) => {
        setSelectedAdmin(admin);
        // Populate form data for edit modal
        setFormData({
            ...admin,
            password: '' // Clear password for security
        });
        setIsEditModalOpen(true);
    };

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: value 
        }));
    };

    // Handle form submission for editing admin
    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleUpdateAdmin();
    };

    // Filter admins based on search query
    const filteredAdmins = admins.filter(admin => 
        admin.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination calculations
    const totalPages = Math.ceil(filteredAdmins.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedAdmins = filteredAdmins.slice(startIndex, startIndex + pageSize);

    // Change current page
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Change number of admins displayed per page
    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = parseInt(event.target.value);
        setPageSize(newSize);
        setCurrentPage(1); // Reset to first page when changing page size
    };

    return (
        <div className="p-6">
            {/* Admin Management Header and Add Admin Button */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Admin Management</h1>
                <button
                    onClick={openAddModal}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Add New Admin
                </button>
            </div>

            {/* Search input field */}
            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search admins..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1); // Reset to first page when searching
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <svg
                        className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </div>

            {/* Admin Table */}
            <div className="bg-white rounded-lg shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedAdmins.map((admin) => (
                                <tr key={admin.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap max-w-[150px] truncate" title={admin.id}>{admin.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap max-w-[200px] truncate" title={admin.username}>{admin.username}</td>
                                    <td className="px-6 py-4 whitespace-nowrap max-w-[250px] truncate" title={admin.email}>{admin.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap max-w-[200px] truncate" title={admin.phoneNumber}>{admin.phoneNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>
                                            {admin.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => openEditModal(admin)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAdmin(admin.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Section */}
                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                    <div className="flex items-center">
                        {/* Page size selector */}
                        <span className="mr-2 text-sm text-gray-700">Show</span>
                        <select
                            value={pageSize}
                            onChange={handlePageSizeChange}
                            className="border border-gray-300 rounded-md text-sm px-2 py-1"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                        <span className="ml-2 text-sm text-gray-700">entries</span>
                    </div>

                    <div className="flex items-center space-x-2">
                        {/* Previous button */}
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded-md text-sm ${
                                currentPage === 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                            }`}
                        >
                            Previous
                        </button>
                        
                        {/* Page numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-1 rounded-md text-sm ${
                                    currentPage === page
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                }`}
                            >
                                {page}
                            </button>
                        ))}

                        {/* Next button */}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded-md text-sm ${
                                currentPage === totalPages
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                            }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Admin Modal */}
            <AddAdminModal
                isOpen={isAddModalOpen}
                formData={formData}
                onClose={() => setIsAddModalOpen(false)}
                onInputChange={handleInputChange}
                onSubmit={handleCreateAdmin}
            />

            {/* Edit Admin Modal */}
            <EditAdminModal
                isOpen={isEditModalOpen}
                formData={formData}
                onClose={() => setIsEditModalOpen(false)}
                onInputChange={handleInputChange}
                onSubmit={handleEditSubmit}
            />
        </div>
    );
}