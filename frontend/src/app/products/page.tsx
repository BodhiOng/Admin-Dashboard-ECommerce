"use client";

import { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ProductDetailsModal from './components/ProductDetailsModal';
import AddProductModal from './components/AddProductModal';

// Mock data
const mockProducts = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Wireless Mouse',
    price: 29.99,
    stock: 45,
    category: 'Electronics',
    description: 'A wireless mouse with long battery life',
    image: 'https://example.com/mouse.jpg'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Mechanical Keyboard',
    price: 89.99,
    stock: 30,
    category: 'Electronics',
    description: 'A mechanical keyboard with customizable backlight',
    image: 'https://example.com/keyboard.jpg'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Gaming Headset',
    price: 59.99,
    stock: 20,
    category: 'Electronics',
    description: 'A gaming headset with 7.1 surround sound',
    image: 'https://example.com/headset.jpg'
  },
];

// Product interface defining the structure of a product
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  image: string;
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
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass()}`}>
      {status}
    </span>
  );
};

export default function Products() {
  // State management for products, search, pagination, and modals
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Initial state for a new product with empty values
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

  // New state for sorting
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product;
    direction: 'ascending' | 'descending';
  } | null>(null);

  // Sorting function
  const sortedProducts = useMemo(() => {
    let sortableProducts = [...products];
    
    if (sortConfig !== null) {
      sortableProducts.sort((a, b) => {
        // Handle different types of sorting
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
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

  // Handle input changes when adding a new product
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { 
    target: { 
      name: string; 
      value: string | number 
    } 
  }) => {
    // Check if it's a standard event or a custom event
    const { name, value } = 'target' in e ? e.target : e;

    setNewProduct(prev => ({
      ...prev,
      // Convert price and stock to numbers, keep other fields as strings
      [name]: 
        name === 'price' || name === 'stock' 
          ? Number(value) 
          : value
    }));
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
    setNewProduct({
      name: '',
      price: 0,
      stock: 0,
      category: '',
      description: '',
      image: ''
    });
  };

  // Open product details modal
  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailsModalOpen(true);
  };

  // Filter products based on search query (case-insensitive)
  const filteredProducts = sortedProducts.filter(product => 
    product.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);

  // Change current page
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Change number of products displayed per page
  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(event.target.value);
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        {/* Add Product button */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
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

      {/* Products table and pagination */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {/* Table headers */}
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
                  onClick={() => requestSort('name')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Name 
                  <SortIcon 
                    isActive={sortConfig?.key === 'name'} 
                    direction={sortConfig?.key === 'name' ? sortConfig.direction : undefined} 
                  />
                </th>
                <th 
                  onClick={() => requestSort('category')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Category
                  <SortIcon 
                    isActive={sortConfig?.key === 'category'} 
                    direction={sortConfig?.key === 'category' ? sortConfig.direction : undefined} 
                  />
                </th>
                <th 
                  onClick={() => requestSort('price')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Price
                  <SortIcon 
                    isActive={sortConfig?.key === 'price'} 
                    direction={sortConfig?.key === 'price' ? sortConfig.direction : undefined} 
                  />
                </th>
                <th 
                  onClick={() => requestSort('stock')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Status
                  <SortIcon 
                    isActive={sortConfig?.key === 'stock'} 
                    direction={sortConfig?.key === 'stock' ? sortConfig.direction : undefined} 
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts
                .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                .map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{product.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusPill stock={product.stock} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => handleViewDetails(product)}
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

      {/* Add Product Modal */}
      {isModalOpen && (
        <AddProductModal 
          newProduct={newProduct}
          onInputChange={handleInputChange}
          onAddProduct={handleAddProduct}
          onClose={() => setIsModalOpen(false)}
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