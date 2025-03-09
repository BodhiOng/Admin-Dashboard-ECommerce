"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';

// Mock data for sales chart
const salesData = [
  { month: 'Jan', sales: 4000 },
  { month: 'Feb', sales: 3000 },
  { month: 'Mar', sales: 5000 },
  { month: 'Apr', sales: 4500 },
  { month: 'May', sales: 6000 },
  { month: 'Jun', sales: 5500 },
  { month: 'Jul', sales: 5000 },
  { month: 'Aug', sales: 5800 },
  { month: 'Sep', sales: 6200 },
  { month: 'Oct', sales: 6500 },
  { month: 'Nov', sales: 6800 },
  { month: 'Dec', sales: 7000 },
];

interface Order {
  _id: string;
  customer: string;
  date: string;
  total: number;
  status: 'Completed' | 'Pending' | 'Processing';
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

interface LowStockItem {
  _id: string;
  name: string;
  stock: number;
}

export default function Dashboard() {
  // State management with explicit types
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // New state for low stock items
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([]);
  const [lowStockLoading, setLowStockLoading] = useState<boolean>(true);
  const [lowStockError, setLowStockError] = useState<string | null>(null);

  // Fetch recent orders
  const fetchRecentOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get<ApiResponse<Order[]>>('/orders', {
        params: {
          sortBy: 'date',
          sortOrder: 'desc'
        }
      });

      if (response.data.success && response.data.data) {
        setOrders(response.data.data);
      } else {
        throw new Error(response.data.error || 'Unknown error occurred');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // New function to fetch low stock items
  const fetchLowStockItems = async () => {
    try {
      setLowStockLoading(true);
      setLowStockError(null);

      const response = await api.get<ApiResponse<LowStockItem[]>>('/products', {
        params: {
          sortBy: 'stock',
          sortOrder: 'asc'
        }
      });

      if (response.data.success && response.data.data) {
        setLowStockItems(response.data.data);
      } else {
        throw new Error(response.data.error || 'Unknown error occurred');
      }
    } catch (err) {
      setLowStockError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLowStockLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchRecentOrders();
    fetchLowStockItems();
  }, []);

  // Loading state component
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Loading orders...</span>
      </div>
    );
  }

  // Error state component
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="p-0 sm:p-6 space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">Dashboard</h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col">
          <h3 className="text-gray-500 text-xs sm:text-sm mb-2">Total Sales</h3>
          <p className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">$24,780</p>
          <span className="text-green-600 text-xs sm:text-sm">+12% from last month</span>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col">
          <h3 className="text-gray-500 text-xs sm:text-sm mb-2">Orders</h3>
          <p className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">156</p>
          <span className="text-green-600 text-xs sm:text-sm">+8% from last month</span>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col">
          <h3 className="text-gray-500 text-xs sm:text-sm mb-2">Customers</h3>
          <p className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">892</p>
          <span className="text-green-600 text-xs sm:text-sm">+5% from last month</span>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col">
          <h3 className="text-gray-500 text-xs sm:text-sm mb-2">Avg. Order Value</h3>
          <p className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">$158.90</p>
          <span className="text-red-600 text-xs sm:text-sm">-2% from last month</span>
        </div>
      </div>

      {/* Sales Graph */}
      <div className="mt-6 bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Sales Overview</h2>
        <div className="h-[180px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#4F46E5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-6 bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 relative">
        <div className="flex flex-row justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
          <Link 
            href="/orders" 
            className="text-indigo-600 hover:text-indigo-800 text-xs flex items-center"
          >
            View More
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Conditional rendering if no orders */}
        {orders.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No recent orders found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-2 sm:px-6 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-2 sm:px-6 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Date
                  </th>
                  <th scope="col" className="px-2 sm:px-6 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-2 sm:px-6 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider sm:table-cell">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-[10px] sm:text-sm text-gray-900">
                      {order.customer}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-[10px] sm:text-sm text-gray-500 hidden sm:table-cell">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-[10px] sm:text-sm text-gray-900">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-1 rounded-full text-[10px] sm:text-sm font-medium 
                        ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                          order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-blue-100 text-blue-800'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Low Stock Alerts */}
      <div className="mt-6 bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 relative">
        <div className="flex flex-row justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Low Stock Alerts</h2>
          <Link 
            href="/products" 
            className="text-indigo-600 hover:text-indigo-800 text-xs flex items-center"
          >
            View More
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Loading State */}
        {lowStockLoading && (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}

        {/* Error State */}
        {lowStockError && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{lowStockError}</span>
          </div>
        )}

        {/* Low Stock Items Table */}
        {!lowStockLoading && !lowStockError && (
          <div className="overflow-x-auto">
            {lowStockItems.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                No low stock items
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-1/3 px-2 sm:px-6 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product ID
                    </th>
                    <th className="w-1/3 px-2 sm:px-6 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="w-1/3 px-2 sm:px-6 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Stock
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lowStockItems.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                      <td className="w-1/3 px-2 sm:px-6 py-4 whitespace-nowrap text-[10px] sm:text-sm text-gray-900 max-w-[100px] truncate">
                        {item._id}
                      </td>
                      <td className="w-1/3 px-2 sm:px-6 py-4 whitespace-nowrap text-[10px] sm:text-sm text-gray-900 max-w-[100px] truncate">
                        {item.name}
                      </td>
                      <td className="w-1/3 px-2 sm:px-6 py-4 whitespace-nowrap text-[10px] sm:text-sm text-gray-900">
                        {item.stock}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
