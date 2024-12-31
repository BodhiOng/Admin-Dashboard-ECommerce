"use client";

import { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ProductDetailsModal from './components/ProductDetailsModal';
import AddProductModal from './components/AddProductModal';
import EditProductModal from './components/EditProductModal';

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
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

  // Update existing product
  const handleUpdateProduct = () => {
    if (!selectedProduct) return;

    setProducts(products.map(product =>
      product.id === selectedProduct.id
        ? {
            ...selectedProduct,
            id: selectedProduct.id  // Preserve the original ID
          }
        : product
    ));

    // Reset states
    setIsEditModalOpen(false);
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

  // Delete product
  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(product => product.id !== productId));
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
    <div className="p-6 md:p-6 max-md:p-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        {/* Add Product button */}
        <button 
          onClick={openAddProductModal}
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

      {/* Desktop Table View */}
      <div className="bg-white rounded-lg shadow-sm hidden md:block">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full min-w-full table-auto">
            <thead>
              {/* Table headers */}
              <tr className="bg-gray-50">
                <th 
                  onClick={() => requestSort('id')}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 truncate max-w-[100px]"
                >
                  ID 
                  <SortIcon 
                    isActive={sortConfig?.key === 'id'} 
                    direction={sortConfig?.key === 'id' ? sortConfig.direction : undefined} 
                  />
                </th>
                <th 
                  onClick={() => requestSort('name')}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 truncate max-w-[200px]"
                >
                  Name 
                  <SortIcon 
                    isActive={sortConfig?.key === 'name'} 
                    direction={sortConfig?.key === 'name' ? sortConfig.direction : undefined} 
                  />
                </th>
                <th 
                  onClick={() => requestSort('category')}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 truncate max-w-[150px]"
                >
                  Category
                  <SortIcon 
                    isActive={sortConfig?.key === 'category'} 
                    direction={sortConfig?.key === 'category' ? sortConfig.direction : undefined} 
                  />
                </th>
                <th 
                  onClick={() => requestSort('price')}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 truncate max-w-[100px]"
                >
                  Price
                  <SortIcon 
                    isActive={sortConfig?.key === 'price'} 
                    direction={sortConfig?.key === 'price' ? sortConfig.direction : undefined} 
                  />
                </th>
                <th 
                  onClick={() => requestSort('stock')}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 truncate max-w-[100px]"
                >
                  Stock
                  <SortIcon 
                    isActive={sortConfig?.key === 'stock'} 
                    direction={sortConfig?.key === 'stock' ? sortConfig.direction : undefined} 
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-[100px]">{product.id}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 truncate max-w-[200px]">{product.name}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-[150px]">{product.category}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-[100px]">${product.price.toFixed(2)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <StatusPill stock={product.stock} />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
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

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {paginatedProducts.map((product) => (
          <div 
            key={product.id} 
            className="bg-white rounded-lg shadow-md p-4 flex flex-col space-y-3"
          >
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
              <span className="text-sm text-gray-500 mt-1 truncate max-w-full overflow-hidden">#{product.id}</span>
            </div>
            
            <div className="flex justify-start items-center mt-2">
              <span className="text-sm text-gray-600 mr-2">Category:</span>
              <span className="text-sm font-medium">{product.category}</span>
            </div>
            
            <div className="flex justify-start items-center mt-2">
              <span className="text-sm text-gray-600 mr-2">Price:</span>
              <span className="text-sm font-medium">${product.price.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-start items-center mt-2">
              <span className="text-sm text-gray-600 mr-2">Stock:</span>
              <StatusPill stock={product.stock} />
            </div>
            
            <div className="flex justify-between items-center pt-3 mt-2 space-x-2">
              <button 
                onClick={() => handleViewDetails(product)}
                className="flex-1 px-3 py-2 border border-indigo-200 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-center text-sm font-semibold"
              >
                View
              </button>
              <button 
                onClick={() => handleEditProduct(product)}
                className="flex-1 px-3 py-2 border border-green-200 text-green-600 rounded-lg hover:bg-green-50 transition-colors text-center text-sm font-semibold"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDeleteProduct(product.id)}
                className="flex-1 px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-center text-sm font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {/* Mobile Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md text-sm ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md text-sm ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
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