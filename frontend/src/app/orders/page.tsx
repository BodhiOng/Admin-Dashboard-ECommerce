"use client";

import { useState, useMemo } from 'react';
import OrderDetailsModal from './components/OrderDetailsModal';

// Mock data
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

interface Order {
  _id: string;
  customer: {
    name: string;
  };
  orderNumber: string;
  date: string;
  status: string;
  total: number;
}

const StatusPill = ({ status }: { status: string }) => {
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(status)}`}>
      {status}
    </span>
  );
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // New state for sorting
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Order;
    direction: 'ascending' | 'descending';
  } | null>(null);

  // Sorting function
  const sortedOrders = useMemo(() => {
    let sortableOrders = [...orders];
    
    if (sortConfig !== null) {
      sortableOrders.sort((a, b) => {
        // Special handling for nested customer.name
        const aValue = sortConfig.key === 'customer.name' 
          ? a.customer.name 
          : a[sortConfig.key as keyof Order];
        const bValue = sortConfig.key === 'customer.name' 
          ? b.customer.name 
          : b[sortConfig.key as keyof Order];

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableOrders;
  }, [orders, sortConfig]);

  // Sorting request handler
  const requestSort = (key: keyof Order) => {
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

  const filteredOrders = sortedOrders.filter(order => 
    order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(event.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  // Function to handle status change
  const handleStatusChange = (orderId: string) => {
    const currentOrder = orders.find(order => order._id === orderId);
    if (!currentOrder) return;

    const statusCycle = ['PENDING', 'PROCESSING', 'COMPLETED'];
    const currentIndex = statusCycle.indexOf(currentOrder.status);
    const nextIndex = (currentIndex + 1) % statusCycle.length;

    const updatedOrders = orders.map(order => 
      order._id === orderId 
        ? { ...order, status: statusCycle[nextIndex] } 
        : order
    );

    setOrders(updatedOrders);
  };

  // Open order details modal
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th 
                  onClick={() => requestSort('orderNumber')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  ID
                  <SortIcon 
                    isActive={sortConfig?.key === 'orderNumber'} 
                    direction={sortConfig?.key === 'orderNumber' ? sortConfig.direction : undefined} 
                  />
                </th>
                <th 
                  onClick={() => requestSort('customer.name')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Customer
                  <SortIcon 
                    isActive={sortConfig?.key === 'customer.name'} 
                    direction={sortConfig?.key === 'customer.name' ? sortConfig.direction : undefined} 
                  />
                </th>
                <th 
                  onClick={() => requestSort('date')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Date
                  <SortIcon 
                    isActive={sortConfig?.key === 'date'} 
                    direction={sortConfig?.key === 'date' ? sortConfig.direction : undefined} 
                  />
                </th>
                <th 
                  onClick={() => requestSort('total')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Total
                  <SortIcon 
                    isActive={sortConfig?.key === 'total'} 
                    direction={sortConfig?.key === 'total' ? sortConfig.direction : undefined} 
                  />
                </th>
                <th 
                  onClick={() => requestSort('status')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Status
                  <SortIcon 
                    isActive={sortConfig?.key === 'status'} 
                    direction={sortConfig?.key === 'status' ? sortConfig.direction : undefined} 
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedOrders.map((order) => (
                <tr 
                  key={order._id} 
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">{order.orderNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.customer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div 
                      onClick={() => handleStatusChange(order._id)}
                      className="cursor-pointer inline-block"
                    >
                      <StatusPill status={order.status} />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => handleViewDetails(order)}
                      className="text-indigo-600 hover:text-indigo-900 hover:underline"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="flex items-center">
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

      {isDetailsModalOpen && selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setIsDetailsModalOpen(false)} 
        />
      )}
    </div>
  );
}