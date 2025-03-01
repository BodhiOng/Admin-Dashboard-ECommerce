"use client";

import { useState, useMemo, useEffect } from 'react';
import OrderDetailsModal from './components/OrderDetailsModal';

interface Order {
  id: string;
  customer: string;
  date: string;
  status: string;
  total: number;
  products: {
    productId: string;
    name: string;
    quantity: number;
  }[];
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalOrders: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  query?: {
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  };
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
    <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium select-none ${getStatusStyle(status)}`}>
      {status}
    </span>
  );
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Order;
    direction: 'ascending' | 'descending';
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  // Sorting request handler
  const requestSort = (key: keyof Order) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
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

  // Filter and sort orders
  const filteredAndSortedOrders = useMemo(() => {
    let result = [...orders];

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        let aValue: any = a[sortConfig.key];
        let bValue: any = b[sortConfig.key];

        // Handle nested customer name
        if (sortConfig.key === 'customer') {
          aValue = a.customer;
          bValue = b.customer;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [orders, sortConfig]);

  // Function to fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Construct query parameters
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(sortConfig && { 
          sortBy: sortConfig.key, 
          sortOrder: sortConfig.direction === 'ascending' ? 'asc' : 'desc' 
        })
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const result: ApiResponse<Order[]> = await response.json();

      if (result.success && result.data) {
        setOrders(result.data);
        
        // Update pagination metadata from API response
        if (result.pagination) {
          setCurrentPage(result.pagination.currentPage);
          setPageSize(result.pagination.pageSize);
          setTotalPages(result.pagination.totalPages);
          setTotalOrders(result.pagination.totalOrders);
          setHasNextPage(result.pagination.hasNextPage);
          setHasPreviousPage(result.pagination.hasPreviousPage);
        }
      } else {
        throw new Error(result.error || 'Unknown error occurred');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setOrders([]); // Clear orders on error
    } finally {
      setLoading(false);
    }
  };

  // Function to update order status
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      const result: ApiResponse<Order> = await response.json();

      if (result.success && result.data) {
        // Update the order in the local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
        return true;
      } else {
        throw new Error(result.error || 'Unknown error occurred');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Search query change handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when search query changes
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Function to handle status change
  const handleStatusChange = (orderId: string) => {
    const currentOrder = orders.find(order => order.id === orderId);
    if (!currentOrder) return;

    const statusCycle = ['Pending', 'Processing', 'Completed'];
    const currentIndex = statusCycle.indexOf(currentOrder.status);
    const nextIndex = (currentIndex + 1) % statusCycle.length;

    updateOrderStatus(orderId, statusCycle[nextIndex]);
  };

  // Open order details modal
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  // Render table rows
  const renderTableRows = () => {
    if (orders.length === 0) {
      return (
        <tr>
          <td colSpan={6} className="text-center py-4 text-gray-500">
            No orders found
          </td>
        </tr>
      );
    }

    return filteredAndSortedOrders.map((order) => (
      <tr key={order.id}>
        <td className="px-6 py-4 whitespace-nowrap truncate max-w-[150px]">{order.id}</td>
        <td className="px-6 py-4 whitespace-nowrap truncate max-w-[200px]">{order.customer}</td>
        <td className="px-6 py-4 whitespace-nowrap">{new Date(order.date).toLocaleDateString()}</td>
        <td className="px-6 py-4 whitespace-nowrap">RM {order.total.toFixed(2)}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div onClick={() => handleStatusChange(order.id)} className="cursor-pointer inline-block">
            <StatusPill status={order.status}/>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <button
            onClick={() => handleViewDetails(order)}
            className="text-indigo-600 hover:text-indigo-900"
          >
            View Details
          </button>
        </td>
      </tr>
    ));
  };

  // Fetch orders when dependencies change
  useEffect(() => {
    fetchOrders();
  }, [currentPage, pageSize, searchQuery, sortConfig]);

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
        {filteredAndSortedOrders.map((order) => (
          <div 
            key={order.id} 
            className="bg-white rounded-lg shadow-md p-4 flex flex-col space-y-3"
          >
            <div className="flex flex-col">
              <h3 className="text-sm font-semibold text-gray-900">{order.id}</h3>
              <span className="text-xs text-gray-500 mt-1 truncate max-w-full overflow-hidden">
                {order.customer}
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

      {/* Desktop Table View */}
      <div className="bg-white rounded-lg shadow-sm hidden md:block">
        <div className="overflow-x-auto max-w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 select-none">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('id')}
                >
                  <div className="flex items-center">
                    ID
                    <SortIcon 
                      isActive={sortConfig?.key === 'id'} 
                      direction={sortConfig?.key === 'id' ? sortConfig.direction : undefined} 
                    />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('customer')}
                >
                  <div className="flex items-center">
                    Customer
                    <SortIcon 
                      isActive={sortConfig?.key === 'customer'} 
                      direction={sortConfig?.key === 'customer' ? sortConfig.direction : undefined} 
                    />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('date')}
                >
                  <div className="flex items-center">
                    Date
                    <SortIcon 
                      isActive={sortConfig?.key === 'date'} 
                      direction={sortConfig?.key === 'date' ? sortConfig.direction : undefined} 
                    />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('total')}
                >
                  <div className="flex items-center">
                    Total
                    <SortIcon 
                      isActive={sortConfig?.key === 'total'} 
                      direction={sortConfig?.key === 'total' ? sortConfig.direction : undefined} 
                    />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    <SortIcon 
                      isActive={sortConfig?.key === 'status'} 
                      direction={sortConfig?.key === 'status' ? sortConfig.direction : undefined} 
                    />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {renderTableRows()}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-700">Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value));
                setCurrentPage(1);
              }}
              className="border rounded-md text-sm p-1"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="ml-2 text-sm text-gray-700">entries</span>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!hasPreviousPage}
              className={`px-3 py-1 rounded-md text-sm ${
                hasPreviousPage
                  ? 'bg-white text-gray-700 border border-gray-300'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Previous
            </button>

            {(() => {
              const windowSize = 5;
              const halfWindow = Math.floor(windowSize / 2);
              
              let startPage = Math.max(1, currentPage - halfWindow);
              let endPage = Math.min(totalPages, startPage + windowSize - 1);
              
              if (endPage - startPage + 1 < windowSize && totalPages > windowSize) {
                startPage = Math.max(1, endPage - windowSize + 1);
              }

              const pageNumbers = [];

              if (startPage > 1) {
                pageNumbers.push(1);
                if (startPage > 2) {
                  pageNumbers.push('...');
                }
              }

              for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
              }

              if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                  pageNumbers.push('...');
                }
                pageNumbers.push(totalPages);
              }
              
              return pageNumbers.map((page, index) => {
                if (page === '...') {
                  return <span key={`ellipsis-${index}-${page}`} className="px-3 py-1">...</span>;
                }
                return (
                  <button
                    key={`page-${page}`}
                    onClick={() => handlePageChange(page as number)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentPage === page
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                );
              });
            })()}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNextPage}
              className={`px-3 py-1 rounded-md text-sm ${
                hasNextPage
                  ? 'bg-white text-gray-700 border border-gray-300'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
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
          specificOrder={selectedOrder} 
          onClose={() => setIsDetailsModalOpen(false)} 
        />
      )}
    </div>
  );
}