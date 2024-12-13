"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for sales chart
const salesData = [
  { month: 'Jan', sales: 4000 },
  { month: 'Feb', sales: 3000 },
  { month: 'Mar', sales: 5000 },
  { month: 'Apr', sales: 4500 },
  { month: 'May', sales: 6000 },
  { month: 'Jun', sales: 5500 },
];

// Mock data for recent orders table
const recentOrders = [
  { id: 1, customer: 'John Doe', product: 'Gaming Mouse', amount: 89.99, status: 'Completed' },
  { id: 2, customer: 'Jane Smith', product: 'Mechanical Keyboard', amount: 159.99, status: 'Pending' },
  { id: 3, customer: 'Bob Johnson', product: 'Monitor', amount: 299.99, status: 'Processing' },
  { id: 4, customer: 'Alice Brown', product: 'Headphones', amount: 129.99, status: 'Completed' },
];

// Mock data for low stock alerts
const lowStockItems = [
  { id: 1, product: 'Wireless Mouse', stock: 5 },
  { id: 2, product: 'USB-C Cable', stock: 3 },
  { id: 3,  product: 'Power Bank', stock: 7 },
];

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm">Total Sales</h3>
          <p className="text-2xl font-bold text-gray-800">$24,780</p>
          <span className="text-green-600 text-sm">+12% from last month</span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm">Orders</h3>
          <p className="text-2xl font-bold text-gray-800">156</p>
          <span className="text-green-600 text-sm">+8% from last month</span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm">Customers</h3>
          <p className="text-2xl font-bold text-gray-800">892</p>
          <span className="text-green-600 text-sm">+5% from last month</span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm">Avg. Order Value</h3>
          <p className="text-2xl font-bold text-gray-800">$158.90</p>
          <span className="text-red-600 text-sm">-2% from last month</span>
        </div>
      </div>

      {/* Sales Graph */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Sales Overview</h2>
        <div className="h-[300px]">
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
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                        order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 
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
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Low Stock Alerts</h2>
        <div className="space-y-4">
          {lowStockItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900">{item.product}</h3>
                <p className="text-sm text-gray-500">Current Stock: {item.stock}</p>
              </div>
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                Low Stock
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
