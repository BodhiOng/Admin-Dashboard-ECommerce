"use client";

import { useState, useMemo } from 'react';
import OrderDetailsModal from './components/OrderDetailsModal';

// Mock data
const mockOrders = [
  {
    id: '1',
    customer: { name: 'John Doe' },
    orderNumber: 'ORD-001',
    date: '2023-12-10',
    status: 'PENDING',
    total: 129.99,
    products: [{ productId: 'PROD-001', name: 'Wireless Headphones', quantity: 1 }]
  },
  {
    id: '2',
    customer: { name: 'Jane Smith' },
    orderNumber: 'ORD-002',
    date: '2023-12-09',
    status: 'COMPLETED',
    total: 259.99,
    products: [{ productId: 'PROD-002', name: 'Smart Watch', quantity: 2 }]
  },
  {
    id: '3',
    customer: { name: 'Mike Johnson' },
    orderNumber: 'ORD-003',
    date: '2023-12-08',
    status: 'PROCESSING',
    total: 89.99,
    products: [{ productId: 'PROD-003', name: 'Bluetooth Speaker', quantity: 1 }]
  },
  {
    id: '4',
    customer: { name: 'Sarah Williams' },
    orderNumber: 'ORD-004',
    date: '2023-12-08',
    status: 'COMPLETED',
    total: 199.99,
    products: [{ productId: 'PROD-004', name: 'Noise Cancelling Earbuds', quantity: 1 }]
  },
  {
    id: '5',
    customer: { name: 'Robert Brown' },
    orderNumber: 'ORD-005',
    date: '2023-12-07',
    status: 'PENDING',
    total: 149.99,
    products: [{ productId: 'PROD-005', name: 'Portable Power Bank', quantity: 1 }]
  },
  {
    id: '6',
    customer: { name: 'Emily Davis' },
    orderNumber: 'ORD-006',
    date: '2023-12-11',
    status: 'PROCESSING',
    total: 349.50,
    products: [{ productId: 'PROD-006', name: 'Gaming Laptop', quantity: 1 }]
  },
  {
    id: '7',
    customer: { name: 'David Wilson' },
    orderNumber: 'ORD-007',
    date: '2023-12-06',
    status: 'COMPLETED',
    total: 79.99,
    products: [{ productId: 'PROD-007', name: 'Wireless Mouse', quantity: 1 }]
  },
  {
    id: '8',
    customer: { name: 'Lisa Martinez' },
    orderNumber: 'ORD-008',
    date: '2023-12-12',
    status: 'PROCESSING',
    total: 219.75,
    products: [{ productId: 'PROD-008', name: 'External SSD', quantity: 1 }]
  },
  {
    id: '9',
    customer: { name: 'Chris Taylor' },
    orderNumber: 'ORD-009',
    date: '2023-12-05',
    status: 'COMPLETED',
    total: 189.50,
    products: [{ productId: 'PROD-009', name: 'Smart Home Camera', quantity: 1 }]
  },
  {
    id: '10',
    customer: { name: 'Amanda Anderson' },
    orderNumber: 'ORD-010',
    date: '2023-12-13',
    status: 'PENDING',
    total: 99.99,
    products: [{ productId: 'PROD-010', name: 'Fitness Tracker', quantity: 1 }]
  },
  {
    id: '11',
    customer: { name: 'Michael Thompson' },
    orderNumber: 'ORD-011',
    date: '2023-12-04',
    status: 'PROCESSING',
    total: 279.99,
    products: [{ productId: 'PROD-011', name: 'Wireless Keyboard', quantity: 1 }]
  },
  {
    id: '12',
    customer: { name: 'Jessica Rodriguez' },
    orderNumber: 'ORD-012',
    date: '2023-12-14',
    status: 'PENDING',
    total: 159.50,
    products: [{ productId: 'PROD-012', name: 'Portable Bluetooth Speaker', quantity: 1 }]
  },
  {
    id: '13',
    customer: { name: 'Kevin Lee' },
    orderNumber: 'ORD-013',
    date: '2023-12-03',
    status: 'COMPLETED',
    total: 299.75,
    products: [{ productId: 'PROD-013', name: 'Wireless Charging Pad', quantity: 1 }]
  },
  {
    id: '14',
    customer: { name: 'Nicole Garcia' },
    orderNumber: 'ORD-014',
    date: '2023-12-15',
    status: 'PROCESSING',
    total: 129.50,
    products: [{ productId: 'PROD-014', name: 'Smart Thermostat', quantity: 1 }]
  },
  {
    id: '15',
    customer: { name: 'Ryan Martinez' },
    orderNumber: 'ORD-015',
    date: '2023-12-02',
    status: 'COMPLETED',
    total: 249.99,
    products: [{ productId: 'PROD-015', name: 'Wireless Router', quantity: 1 }]
  },
  {
    id: '16',
    customer: { name: 'Sophia Clark' },
    orderNumber: 'ORD-016',
    date: '2023-12-16',
    status: 'PENDING',
    total: 179.50,
    products: [{ productId: 'PROD-016', name: 'Smart Display', quantity: 1 }]
  },
  {
    id: '17',
    customer: { name: 'Daniel Rodriguez' },
    orderNumber: 'ORD-017',
    date: '2023-12-01',
    status: 'PROCESSING',
    total: 399.75,
    products: [{ productId: 'PROD-017', name: '4K Monitor', quantity: 1 }]
  },
  {
    id: '18',
    customer: { name: 'Olivia White' },
    orderNumber: 'ORD-018',
    date: '2023-12-17',
    status: 'COMPLETED',
    total: 109.99,
    products: [{ productId: 'PROD-018', name: 'Wireless Earphones', quantity: 1 }]
  },
  {
    id: '19',
    customer: { name: 'Ethan Harris' },
    orderNumber: 'ORD-019',
    date: '2023-11-30',
    status: 'PENDING',
    total: 269.50,
    products: [{ productId: 'PROD-019', name: 'Smart Home Hub', quantity: 1 }]
  },
  {
    id: '20',
    customer: { name: 'Isabella Martin' },
    orderNumber: 'ORD-020',
    date: '2023-12-18',
    status: 'PROCESSING',
    total: 189.75,
    products: [{ productId: 'PROD-020', name: 'Wireless Charging Stand', quantity: 1 }]
  }
];

interface Order {
  id: string;
  customer: {
    name: string;
  };
  orderNumber: string;
  date: string;
  status: string;
  total: number;
  products: {
    productId: string;
    name: string;
    quantity: number;
  }[];
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
    <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getStatusStyle(status)}`}>
      {status}
    </span>
  );
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // New state for sorting
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Order | 'customer.name';
    direction: 'ascending' | 'descending';
  } | null>(null);

  // Sorting function
  const sortedOrders = useMemo(() => {
    let sortableOrders = [...orders];
    
    if (sortConfig !== null) {
      sortableOrders.sort((a, b) => {
        // Handle nested customer.name sorting
        const aValue = sortConfig.key === 'customer.name' 
          ? a.customer.name 
          : a[sortConfig.key as keyof Order] ?? '';
        const bValue = sortConfig.key === 'customer.name' 
          ? b.customer.name 
          : b[sortConfig.key as keyof Order] ?? '';

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
    
    return sortableOrders;
  }, [orders, sortConfig]);

  // Sorting request handler
  const requestSort = (key: keyof Order | 'customer.name') => {
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

  const filteredOrders = useMemo(() => {
    if (!searchQuery) return sortedOrders;

    return sortedOrders.filter(order => 
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sortedOrders, searchQuery]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + pageSize);

  // Change current page
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Change number of orders displayed per page
  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(event.target.value);
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Function to handle status change
  const handleStatusChange = (orderId: string) => {
    const currentOrder = orders.find(order => order.id === orderId);
    if (!currentOrder) return;

    const statusCycle = ['PENDING', 'PROCESSING', 'COMPLETED'];
    const currentIndex = statusCycle.indexOf(currentOrder.status);
    const nextIndex = (currentIndex + 1) % statusCycle.length;

    const updatedOrders = orders.map(order => 
      order.id === orderId 
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on search
  };

  return (
    <div className="p-6 md:p-6 max-md:p-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
      </div>

      {/* Search input */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search orders..."
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

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {paginatedOrders.map((order) => (
          <div 
            key={order.id} 
            className="bg-white rounded-lg shadow-md p-4 flex flex-col space-y-3"
          >
            <div className="flex flex-col">
              <h3 className="text-base font-semibold text-gray-900">{order.orderNumber}</h3>
              <span className="text-xs text-gray-500 mt-1 truncate max-w-full overflow-hidden">
                {order.customer.name}
              </span>
            </div>
            
            <div className="flex justify-start items-center mt-2">
              <span className="text-xs text-gray-600 mr-2">Date:</span>
              <span className="text-xs font-medium">{order.date}</span>
            </div>
            
            <div className="flex justify-start items-center mt-2">
              <span className="text-xs text-gray-600 mr-2">Total:</span>
              <span className="text-xs font-medium">${order.total.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-start items-center mt-2">
              <span className="text-xs text-gray-600 mr-2">Status:</span>
              <div onClick={() => handleStatusChange(order.id)} className="cursor-pointer inline-block">
                <StatusPill status={order.status} />
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-0 mt-2 space-x-2">
              <button 
                onClick={() => handleViewDetails(order)}
                className="flex-1 px-3 py-2 border-2 text-indigo-600 rounded-lg text-center text-xs font-semibold"
              >
                View Details
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

      {/* Table */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table header */}
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
            {/* Table body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedOrders.map((order) => (
                <tr 
                  key={order.id} 
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">{order.orderNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.customer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div 
                      onClick={() => handleStatusChange(order.id)}
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

        {/* Pagination controls */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          {/* Show entries dropdown */}
          <div className="flex items-center">
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

          {/* Previous button */}
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

      {/* Order Details Modal */}
      {isDetailsModalOpen && selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setIsDetailsModalOpen(false)} 
        />
      )}
    </div>
  );
}