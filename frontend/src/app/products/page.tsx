"use client";

import { useState, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ProductDetailsModal from './components/ProductDetailsModal';
import AddProductModal from './components/AddProductModal';
import EditProductModal from './components/EditProductModal';

// Interface for a product
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  image: string;
}

// Interface for API response
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalProducts: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  query?: {
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  };
}

// StatusPill component to display product stock status with color-coded indicators
const StatusPill = ({ stock }: { stock: number }) => {
  // Determine stock status based on current stock level
  const getStatus = (stock: number) => {
    if (stock > 20) {
      return 'In Stock';
    } else if (stock > 0) {
      return 'Low Stock';
    } else {
      return 'Out of Stock';
    }
  };
  const status = getStatus(stock);

  // Select color based on stock status
  const colorClass = () => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium ${colorClass()}`}>
      {status}
    </span>
  );
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    category: '',
    description: '',
    image: ''
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product;
    direction: 'ascending' | 'descending';
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  // Sorting function
  const sortedProducts = useMemo(() => {
    let sortableProducts = [...products];
    
    if (sortConfig !== null) {
      sortableProducts.sort((a, b) => {
        // Handle different types of sorting
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
    
    return sortableProducts;
  }, [products, sortConfig]);

  // Sorting request handler
  const requestSort = (key: keyof Product) => {
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

  // Handle input changes when adding/editing a product
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { 
    target: { 
      name: string; 
      value: string | number 
    } 
  }) => {
    // Check if it's a standard event or a custom event
    const { name, value } = 'target' in e ? e.target : e;

    // Determine which state to update based on whether a product is selected
    if (selectedProduct) {
      setSelectedProduct(prev => {
        if (!prev) return null;
        return {
          ...prev,
          [name]: 
            name === 'price' || name === 'stock' 
              ? Number(value) 
              : value
        };
      });
    } else {
      setNewProduct(prev => ({
        ...prev,
        [name]: 
          name === 'price' || name === 'stock' 
            ? Number(value) 
            : value
      }));
    }
  };

  // Handler to add a new product
  const handleAddProduct = () => {
    // Validate that all required fields are filled
    if (
      newProduct.name.trim() === '' ||
      newProduct.price <= 0 ||
      newProduct.stock < 0 ||
      newProduct.category.trim() === '' ||
      newProduct.description.trim() === '' ||
      newProduct.image === ''
    ) {
      alert('Please fill in all fields');
      return;
    }

    // Create a new product with a unique ID
    const productToAdd = {
      ...newProduct,
      id: uuidv4()
    };

    // Add the new product to the list
    setProducts(prevProducts => [...prevProducts, productToAdd]);

    // Close the modal and reset the new product state
    setIsModalOpen(false);
    setSelectedProduct(null);
    setNewProduct({
      name: '',
      price: 0,
      stock: 0,
      category: '',
      description: '',
      image: ''
    });
  };

  // Function to update a specific product
  const updateProduct = async (productId: string, updatedProduct: Omit<Product, 'id'>) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct)
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      const result: ApiResponse<Product> = await response.json();

      if (result.success && result.data) {
        // Update the product in the list
        setProducts(prevProducts => 
          prevProducts.map(product => 
            product.id === productId ? result.data! : product
          )
        );

        // Close the edit modal
        setIsEditModalOpen(false);
        setSelectedProduct(null);
      } else {
        throw new Error(result.error || 'Unknown error occurred while updating product');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Update existing product
  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;
    await updateProduct(selectedProduct.id, selectedProduct);
  };

  // Function to delete a specific product
  const deleteProduct = async (productId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      const result: ApiResponse<null> = await response.json();

      if (result.success) {
        // Remove the deleted product from the list
        setProducts(prevProducts => 
          prevProducts.filter(product => product.id !== productId)
        );

        // Adjust pagination if needed
        if (products.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        throw new Error(result.error || 'Unknown error occurred while deleting product');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const handleDeleteProduct = (productId: string) => {
    deleteProduct(productId);
  };

  // Open product details modal
  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailsModalOpen(true);
  };

  // Open edit modal
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  // Open add product modal
  const openAddProductModal = () => {
    // Reset to completely empty product
    setNewProduct({
      name: '',
      price: 0,
      stock: 0,
      category: '',
      description: '',
      image: ''
    });
    // Clear any selected product
    setSelectedProduct(null);
    // Open the modal
    setIsModalOpen(true);
  };

  // Pagination handler
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      console.log('Page change prevented');
    }
  };

  // Search query change handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when search query changes
  };

  // Function to fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products?page=${currentPage}&limit=${pageSize}${searchQuery ? `&search=${searchQuery}` : ''}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const result: ApiResponse<Product[]> = await response.json();

      if (result.success && result.data) {
        setProducts(result.data);

        // Update pagination metadata
        if (result.pagination) {
          setTotalPages(result.pagination.totalPages);
          setTotalProducts(result.pagination.totalProducts);
          setHasNextPage(result.pagination.hasNextPage);
          setHasPreviousPage(result.pagination.hasPreviousPage);
        }
      } else {
        throw new Error(result.error || 'Unknown error occurred');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and page change
  useEffect(() => {
    fetchProducts();
  }, [currentPage, pageSize, searchQuery]);

  // Error state component
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  // Render table rows
  const renderTableRows = () => {
    if (products.length === 0) {
      return (
        <tr>
          <td colSpan={6} className="text-center py-4 text-gray-500">
            No products found
          </td>
        </tr>
      );
    }

    return products.map((product) => (
      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap max-w-[150px] truncate" title={product.id}>{product.id}</td>
        <td className="px-6 py-4 whitespace-nowrap max-w-[200px] truncate" title={product.name}>{product.name}</td>
        <td className="px-6 py-4 whitespace-nowrap max-w-[150px] truncate" title={product.category}>{product.category}</td>
        <td className="px-6 py-4 whitespace-nowrap max-w-[100px] truncate" title={`${product.price.toFixed(2)}`}>RM {product.price.toFixed(2)}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <StatusPill stock={product.stock} />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex space-x-2">
            <button 
              onClick={() => handleViewDetails(product)}
              className="text-indigo-600 hover:text-indigo-900"
            >
              View
            </button>
            <button 
              onClick={() => handleEditProduct(product)}
              className="text-green-600 hover:text-green-900"
            >
              Edit
            </button>
            <button 
              onClick={() => handleDeleteProduct(product.id)}
              className="text-red-600 hover:text-red-900"
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <div className="p-6 md:p-6 max-md:p-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        {/* Add Product button */}
        <button 
          onClick={openAddProductModal}
          className="px-3 py-2 md:px-4 md:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs md:text-base"
        >
          Add Product
        </button>
      </div>

      {/* Search input field */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
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

      {/* Desktop Table View */}
      <div className="bg-white rounded-lg shadow-sm hidden md:block">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full min-w-full table-auto">
            <thead>
              {/* Table headers */}
              <tr className="bg-gray-50">
                <th 
                  onClick={() => requestSort('id')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                >
                  ID 
                  <SortIcon 
                    isActive={sortConfig?.key === 'id'} 
                    direction={sortConfig?.key === 'id' ? sortConfig.direction : undefined} 
                  />
                </th>
                <th 
                  onClick={() => requestSort('name')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                >
                  Name 
                  <SortIcon 
                    isActive={sortConfig?.key === 'name'} 
                    direction={sortConfig?.key === 'name' ? sortConfig.direction : undefined} 
                  />
                </th>
                <th 
                  onClick={() => requestSort('category')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                >
                  Category
                  <SortIcon 
                    isActive={sortConfig?.key === 'category'} 
                    direction={sortConfig?.key === 'category' ? sortConfig.direction : undefined} 
                  />
                </th>
                <th 
                  onClick={() => requestSort('price')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                >
                  Price
                  <SortIcon 
                    isActive={sortConfig?.key === 'price'} 
                    direction={sortConfig?.key === 'price' ? sortConfig.direction : undefined} 
                  />
                </th>
                <th 
                  onClick={() => requestSort('stock')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                >
                  Stock
                  <SortIcon 
                    isActive={sortConfig?.key === 'stock'} 
                    direction={sortConfig?.key === 'stock' ? sortConfig.direction : undefined} 
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider select-none">
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
            {/* Page size selector */}
            <span className="mr-2 text-sm text-gray-700">Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value));
                setCurrentPage(1);
              }}
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
                  : 'bg-white text-gray-700 border border-gray-300'
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
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="bg-white rounded-lg shadow-md p-4 flex flex-col space-y-3"
          >
            <div className="flex flex-col">
              <h3 className="text-base font-semibold text-gray-900">{product.name}</h3>
              <span className="text-xs text-gray-500 mt-1 truncate max-w-full overflow-hidden">#{product.id}</span>
            </div>
            
            <div className="flex justify-start items-center mt-2">
              <span className="text-xs text-gray-600 mr-2">Category:</span>
              <span className="text-xs font-medium">{product.category}</span>
            </div>
            
            <div className="flex justify-start items-center mt-2">
              <span className="text-xs text-gray-600 mr-2">Price:</span>
              <span className="text-xs font-medium">RM {product.price.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-start items-center mt-2">
              <span className="text-xs text-gray-600 mr-2">Stock:</span>
              <StatusPill stock={product.stock} />
            </div>
            
            <div className="flex justify-between items-center pt-0 mt-2 space-x-2">
              <button 
                onClick={() => handleViewDetails(product)}
                className="flex-1 px-3 py-2 border-2 text-indigo-600 rounded-lg text-center text-xs font-semibold"
              >
                View
              </button>
              <button 
                onClick={() => handleEditProduct(product)}
                className="flex-1 px-3 py-2 border-2 text-green-600 rounded-lg text-center text-xs font-semibold"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDeleteProduct(product.id)}
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

      {/* Add Product Modal */}
      {isModalOpen && (
        <AddProductModal 
          newProduct={newProduct}
          onInputChange={handleInputChange}
          onAddProduct={handleAddProduct}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && selectedProduct && (
        <EditProductModal 
          selectedProduct={selectedProduct}
          originalProduct={products.find(p => p.id === selectedProduct.id)!}
          onInputChange={handleInputChange}
          onUpdateProduct={handleUpdateProduct}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}

      {/* Product Details Modal */}
      {isDetailsModalOpen && selectedProduct && (
        <ProductDetailsModal 
          product={selectedProduct} 
          onClose={() => setIsDetailsModalOpen(false)} 
        />
      )}
    </div>
  );
}