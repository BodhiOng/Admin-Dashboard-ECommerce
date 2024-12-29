"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

// Mock data for sales chart
const salesData = [
  { month: 'Jan', sales: 4000 },
  { month: 'Feb', sales: 3000 },
  { month: 'Mar', sales: 5000 },
  { month: 'Apr', sales: 4500 },
  { month: 'May', sales: 6000 },
  { month: 'Jun', sales: 5500 },
];

// Mock data for recent orders
const mockOrders = [
  {
    _id: '1',
    customer: { name: 'John Doe' },
    orderNumber: 'ORD-001',
    date: '2023-12-10',
    status: 'PENDING',
    total: 129.99,
  },
  {
    _id: '2',
    customer: { name: 'Jane Smith' },
    orderNumber: 'ORD-002',
    date: '2023-12-09',
    status: 'COMPLETED',
    total: 259.99,
  },
  {
    _id: '3',
    customer: { name: 'Mike Johnson' },
    orderNumber: 'ORD-003',
    date: '2023-12-08',
    status: 'PROCESSING',
    total: 89.99,
  },
  {
    _id: '4',
    customer: { name: 'Sarah Williams' },
    orderNumber: 'ORD-004',
    date: '2023-12-08',
    status: 'COMPLETED',
    total: 199.99,
  },
  {
    _id: '5',
    customer: { name: 'Robert Brown' },
    orderNumber: 'ORD-005',
    date: '2023-12-07',
    status: 'PENDING',
    total: 149.99,
  },
];

// Mock data for low stock alerts
const lowStockItems = [
  { id: 1, product: 'Wireless Mouse', stock: 5 },
  { id: 2, product: 'USB-C Cable', stock: 3 },
  { id: 3,  product: 'Power Bank', stock: 7 },
];

export default function Dashboard() {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">Dashboard</h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <div className="h-[200px] sm:h-[300px]">
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-0">Recent Orders</h2>
          <Link 
            href="/orders" 
            className="text-indigo-600 hover:text-indigo-800 text-xs sm:text-sm flex items-center"
          >
            View More
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 sm:px-6 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Order Number</th>
                <th className="px-2 sm:px-6 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-2 sm:px-6 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                <th className="px-2 sm:px-6 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-2 sm:px-6 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockOrders.slice(0, 5).map((order) => (
                <tr key={order._id}>
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-[10px] sm:text-sm font-medium text-gray-900 hidden sm:table-cell">{order.orderNumber}</td>
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-[10px] sm:text-sm text-gray-900">{order.customer.name}</td>
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-[10px] sm:text-sm text-gray-500 hidden sm:table-cell">{order.date}</td>
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-[10px] sm:text-sm text-gray-900">${order.total.toFixed(2)}</td>
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-sm font-medium 
                      ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-blue-100 text-blue-800'}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="mt-6 bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Low Stock Alerts</h2>
        <div className="space-y-4">
          {lowStockItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-900">{item.product}</h3>
                <p className="text-[10px] sm:text-sm text-gray-500">Current Stock: {item.stock}</p>
              </div>
              <span className="px-2 py-1 text-[10px] sm:text-xs font-semibold rounded-full bg-red-100 text-red-800">
                Low Stock
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
