"use client";

import React, { useState, useMemo } from 'react';
import AddAdminModal from './components/AddAdminModal';
import EditAdminModal from './components/EditAdminModal';

// Mock initial admin data
const mockAdmins: Admin[] = [
    {
        id: 'ADM-0001',
        username: 'johndoe',
        email: 'john.doe@gmail.com',
        phoneNumber: '+6011351561561',
        role: 'Current Admin',
    },
    {
        id: 'ADM-0002',
        username: 'janesmith',
        email: 'jane.smith@gmail.com',
        phoneNumber: '+6056153156161',
        role: 'Admin Applicant',
    },
    {
        id: 'ADM-0003',
        username: 'mikebrown',
        email: 'mike.brown@company.com',
        phoneNumber: '+6012345678901',
        role: 'Current Admin',
    },
    {
        id: 'ADM-0004',
        username: 'sarahlee',
        email: 'sarah.lee@enterprise.org',
        phoneNumber: '+6087654321098',
        role: 'Admin Applicant',
    },
    {
        id: 'ADM-0005',
        username: 'davidwong',
        email: 'david.wong@corporation.net',
        phoneNumber: '+6023456789012',
        role: 'Current Admin',
    },
    {
        id: 'ADM-0006',
        username: 'emilytang',
        email: 'emily.tang@startup.io',
        phoneNumber: '+6098765432109',
        role: 'Admin Applicant',
    },
    {
        id: 'ADM-0007',
        username: 'alexchang',
        email: 'alex.chang@tech.com',
        phoneNumber: '+6034567890123',
        role: 'Current Admin',
    },
    {
        id: 'ADM-0008',
        username: 'oliviachen',
        email: 'olivia.chen@digital.org',
        phoneNumber: '+6076543210987',
        role: 'Admin Applicant',
    },
    {
        id: 'ADM-0009',
        username: 'ryantan',
        email: 'ryan.tan@innovation.net',
        phoneNumber: '+6045678901234',
        role: 'Current Admin',
    },
    {
        id: 'ADM-0010',
        username: 'sophialam',
        email: 'sophia.lam@solutions.io',
        phoneNumber: '+6054321098765',
        role: 'Admin Applicant',
    },
    {
        id: 'ADM-0011',
        username: 'ethankim',
        email: 'ethan.kim@global.com',
        phoneNumber: '+6056789012345',
        role: 'Current Admin',
    },
    {
        id: 'ADM-0012',
        username: 'isabellawu',
        email: 'isabella.wu@enterprise.org',
        phoneNumber: '+6043210987654',
        role: 'Admin Applicant',
    },
    {
        id: 'ADM-0013',
        username: 'danielnguyen',
        email: 'daniel.nguyen@technology.net',
        phoneNumber: '+6067890123456',
        role: 'Current Admin',
    },
    {
        id: 'ADM-0014',
        username: 'amandachow',
        email: 'amanda.chow@startup.io',
        phoneNumber: '+6032109876543',
        role: 'Admin Applicant',
    },
    {
        id: 'ADM-0015',
        username: 'williamlin',
        email: 'william.lin@digital.com',
        phoneNumber: '+6078901234567',
        role: 'Current Admin',
    },
    {
        id: 'ADM-0016',
        username: 'hannahyang',
        email: 'hannah.yang@corporation.org',
        phoneNumber: '+6021098765432',
        role: 'Admin Applicant',
    },
    {
        id: 'ADM-0017',
        username: 'jasonzhang',
        email: 'jason.zhang@innovation.net',
        phoneNumber: '+6089012345678',
        role: 'Current Admin',
    },
    {
        id: 'ADM-0018',
        username: 'graceteo',
        email: 'grace.teo@solutions.com',
        phoneNumber: '+6010987654321',
        role: 'Admin Applicant',
    },
    {
        id: 'ADM-0019',
        username: 'kevinliu',
        email: 'kevin.liu@tech.org',
        phoneNumber: '+6090123456789',
        role: 'Current Admin',
    },
    {
        id: 'ADM-0020',
        username: 'rachelchen',
        email: 'rachel.chen@global.io',
        phoneNumber: '+6001234567890',
        role: 'Admin Applicant',
    }
];

// Admin interface for type safety
interface Admin {
    id: string;
    username: string;
    email: string;
    phoneNumber: string;
    role: 'Current Admin' | 'Admin Applicant';
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
        role: 'Current Admin',
        password: ''
    });

    // Search and Pagination states
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // New state for sorting
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Admin;
        direction: 'ascending' | 'descending';
    } | null>(null);

    // Sorting function
    const sortedAdmins = useMemo(() => {
        let sortableAdmins = [...admins];
        
        if (sortConfig !== null) {
            sortableAdmins.sort((a, b) => {
                // Safely get values with type coercion and default
                const aValue = a[sortConfig.key] ?? '';
                const bValue = b[sortConfig.key] ?? '';

                // Compare values as strings to ensure consistent sorting
                const aString = String(aValue).toLowerCase();
                const bString = String(bValue).toLowerCase();

                if (aString < bString) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aString > bString) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        
        return sortableAdmins;
    }, [admins, sortConfig]);

    // Sorting request handler
    const requestSort = (key: keyof Admin) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        
        // If already sorting by this key, toggle direction
        if (sortConfig && sortConfig.key === key) {
            direction = sortConfig.direction === 'ascending' 
                ? 'descending' 
                : 'ascending';
        }
        
        setSortConfig({ key, direction });
    };

    // Sorting icon component
    const SortIcon = ({ isActive, direction }: { 
        isActive: boolean; 
        direction?: 'ascending' | 'descending' 
    }) => {
        if (!isActive) return <span className="ml-1 text-gray-300">↕</span>;
        
        return direction === 'ascending' 
            ? <span className="ml-1 text-gray-600">▲</span> 
            : <span className="ml-1 text-gray-600">▼</span>;
    };

    // Filter admins based on search query
    const filteredAdmins = sortedAdmins.filter(admin => 
        admin.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination calculations
    const totalPages = Math.ceil(filteredAdmins.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedAdmins = filteredAdmins.slice(startIndex, startIndex + pageSize);

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
            role: 'Current Admin',
        };
        
        // Add new admin to the list
        setAdmins(prevAdmins => [...prevAdmins, admin]);
        
        // Reset form and close modal
        setFormData({
            id: '',
            username: '',
            email: '',
            phoneNumber: '',
            role: 'Current Admin',
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
                    role: formData.role,  // Use the selected role from the form
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
            role: 'Current Admin',
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
            role: 'Current Admin',
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

    // Change current page
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Change number of admins displayed per page
    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = parseInt(event.target.value);
        setPageSize(newSize);
        setCurrentPage(1); // Reset to first page when changing page size
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    return (
        <div className="p-6 md:p-6 max-md:p-0">
            {/* Admin Management Header and Add Admin Button */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Admin Management</h1>
                <button
                    onClick={openAddModal}
                    className="px-3 py-2 md:px-4 md:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs md:text-base"
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
                        onChange={handleSearchChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base"
                    />
                    {searchQuery ? (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setCurrentPage(1);
                            }}
                            className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 hover:text-gray-600"
                        >
                            {/* Clear search icon */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path 
                                    fillRule="evenodd" 
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                                    clipRule="evenodd" 
                                />
                            </svg>
                        </button>
                    ) : (
                        // Search icon
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
                    )}
                </div>
            </div>

            {/* Admin Table */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th 
                                    onClick={() => requestSort('id')}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                >
                                    ID
                                    <SortIcon 
                                        isActive={sortConfig?.key === 'id'} 
                                        direction={sortConfig?.key === 'id' ? sortConfig.direction : undefined} 
                                    />
                                </th>
                                <th 
                                    onClick={() => requestSort('username')}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                >
                                    Username
                                    <SortIcon 
                                        isActive={sortConfig?.key === 'username'} 
                                        direction={sortConfig?.key === 'username' ? sortConfig.direction : undefined} 
                                    />
                                </th>
                                <th 
                                    onClick={() => requestSort('email')}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                >
                                    Email
                                    <SortIcon 
                                        isActive={sortConfig?.key === 'email'} 
                                        direction={sortConfig?.key === 'email' ? sortConfig.direction : undefined} 
                                    />
                                </th>
                                <th 
                                    onClick={() => requestSort('phoneNumber')}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                >
                                    Phone Number
                                    <SortIcon 
                                        isActive={sortConfig?.key === 'phoneNumber'} 
                                        direction={sortConfig?.key === 'phoneNumber' ? sortConfig.direction : undefined} 
                                    />
                                </th>
                                <th 
                                    onClick={() => requestSort('role')}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                >
                                    Role
                                    <SortIcon 
                                        isActive={sortConfig?.key === 'role'} 
                                        direction={sortConfig?.key === 'role' ? sortConfig.direction : undefined} 
                                    />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
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
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            admin.role === 'Current Admin' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {admin.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-left">
                                        <div className="flex justify-start space-x-2">
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
                        
                        {(() => {
                          const windowSize = 5; // Number of page buttons to show
                          const halfWindow = Math.floor(windowSize / 2);
                          
                          // Calculate the start and end of the page number window
                          let startPage = Math.max(1, currentPage - halfWindow);
                          let endPage = Math.min(totalPages, startPage + windowSize - 1);
                          
                          // Adjust if we're near the end or start of total pages
                          if (endPage - startPage + 1 < windowSize) {
                            startPage = Math.max(1, endPage - windowSize + 1);
                          }
                          
                          // Generate page number buttons
                          return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-1 rounded-md text-sm ${
                                currentPage === page
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-white text-gray-700 border border-gray-300'
                              }`}
                            >
                              {page}
                            </button>
                          ));
                        })()}
                        
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

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {paginatedAdmins.map((admin) => (
                    <div key={admin.id} className="bg-white shadow-md rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-base font-semibold text-gray-800">{admin.username}</h3>
                        </div>
                        
                        <div className="space-y-1">
                            <span className="block text-xs text-gray-500 truncate max-w-full overflow-hidden">
                                {admin.id}
                            </span>
                        </div>

                        <div className="flex justify-start items-center mt-2">
                            <span className="text-xs text-gray-600 mr-2">Email:</span>
                            <span className="text-xs text-gray-800">{admin.email}</span>
                        </div>
                        
                        <div className="flex justify-start items-center mt-2">
                            <span className="text-xs text-gray-600 mr-2">Phone:</span>
                            <span className="text-xs text-gray-800">{admin.phoneNumber}</span>
                        </div>
                        
                        <div className="flex justify-start items-center mt-2">
                            <span className="text-xs text-gray-600 mr-2">Role:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                admin.role === 'Current Admin' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {admin.role}
                            </span>
                        </div>
                        
                        <div className="flex justify-between items-center pt-0 mt-2 space-x-2">
                            <button 
                                onClick={() => openEditModal(admin)}
                                className="flex-1 px-3 py-2 border-2 text-green-600 rounded-lg text-center text-xs font-semibold"
                            >
                                Edit
                            </button>
                            <button 
                                onClick={() => handleDeleteAdmin(admin.id)}
                                className="flex-1 px-3 py-2 border-2 text-red-600 rounded-lg text-center text-xs font-semibold"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

                {/* Mobile Pagination */}
                <div className="flex justify-between items-center mt-4 space-x-4">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`w-24 px-4 py-2 rounded-md text-sm ${
                            currentPage === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-gray-700 border border-gray-300'
                        }`}
                    >
                        Previous
                    </button>
                    
                    <span className="text-sm text-gray-700 min-w-[100px] text-center">
                        Page {currentPage} of {totalPages}
                    </span>
                    
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`w-24 px-4 py-2 rounded-md text-sm ${
                            currentPage === totalPages
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-gray-700 border border-gray-300'
                        }`}
                    >
                        Next
                    </button>
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