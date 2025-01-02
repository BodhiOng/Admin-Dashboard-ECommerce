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
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Mechanical Keyboard',
    price: 89.99,
    stock: 30,
    category: 'Electronics',
    description: 'A mechanical keyboard with customizable backlight',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Gaming Headset',
    price: 59.99,
    stock: 20,
    category: 'Electronics',
    description: 'A gaming headset with 7.1 surround sound',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Smart Watch',
    price: 199.99,
    stock: 15,
    category: 'Wearables',
    description: 'Advanced fitness tracking smartwatch',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'Noise Cancelling Headphones',
    price: 249.99,
    stock: 25,
    category: 'Electronics',
    description: 'Premium wireless noise cancelling headphones',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    name: 'Portable Bluetooth Speaker',
    price: 79.99,
    stock: 40,
    category: 'Audio',
    description: 'Waterproof portable bluetooth speaker',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440007',
    name: '4K Ultra HD Monitor',
    price: 349.99,
    stock: 10,
    category: 'Electronics',
    description: '27-inch 4K monitor with HDR support',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440008',
    name: 'Ergonomic Office Chair',
    price: 249.99,
    stock: 20,
    category: 'Furniture',
    description: 'Adjustable ergonomic office chair with lumbar support',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440009',
    name: 'Wireless Charger Pad',
    price: 39.99,
    stock: 50,
    category: 'Accessories',
    description: 'Fast wireless charging pad for smartphones',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440010',
    name: 'External SSD',
    price: 129.99,
    stock: 35,
    category: 'Storage',
    description: '1TB portable external solid state drive',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440011',
    name: 'Mechanical Gaming Mouse',
    price: 69.99,
    stock: 30,
    category: 'Gaming',
    description: 'High-precision gaming mouse with customizable weights',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440012',
    name: 'Laptop Stand',
    price: 49.99,
    stock: 45,
    category: 'Accessories',
    description: 'Adjustable aluminum laptop stand for ergonomic working',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440013',
    name: 'Wireless Earbuds',
    price: 99.99,
    stock: 40,
    category: 'Audio',
    description: 'True wireless earbuds with noise cancellation',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440014',
    name: 'Smart Home Hub',
    price: 129.99,
    stock: 25,
    category: 'Smart Home',
    description: 'Central control hub for smart home devices',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440015',
    name: 'Mechanical Desk Lamp',
    price: 79.99,
    stock: 30,
    category: 'Lighting',
    description: 'LED desk lamp with adjustable color temperature',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440016',
    name: 'Graphic Tablet',
    price: 199.99,
    stock: 15,
    category: 'Electronics',
    description: 'Digital drawing tablet with pressure sensitivity',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440017',
    name: 'Wireless Router',
    price: 89.99,
    stock: 35,
    category: 'Networking',
    description: 'Dual-band WiFi 6 wireless router',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440018',
    name: 'Portable Power Bank',
    price: 49.99,
    stock: 50,
    category: 'Accessories',
    description: '20000mAh power bank with fast charging',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440019',
    name: 'Webcam',
    price: 79.99,
    stock: 40,
    category: 'Electronics',
    description: '4K webcam with built-in noise-cancelling microphone',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440020',
    name: 'Smart Thermostat',
    price: 249.99,
    stock: 20,
    category: 'Smart Home',
    description: 'WiFi-enabled smart thermostat with mobile app control',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
  }
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
    <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium ${colorClass()}`}>
      {status}
    </span>
  );
};

export default function Products() {
  // State management for products, search, pagination, and modals
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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

  // Search query change handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(1);  // Reset to first page when search query changes
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
                  Stock
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
              {paginatedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap max-w-[150px] truncate" title={product.id}>{product.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap max-w-[200px] truncate" title={product.name}>{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap max-w-[150px] truncate" title={product.category}>{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap max-w-[100px] truncate" title={`$${product.price.toFixed(2)}`}>${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusPill stock={product.stock} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left">
                    <div className="flex justify-start space-x-2">
                      <button 
                        onClick={() => handleViewDetails(product)}
                        className="text-indigo-600 text-base"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleEditProduct(product)}
                        className="text-green-600 text-base"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 text-base"
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
        {paginatedProducts.map((product) => (
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
              <span className="text-xs font-medium">${product.price.toFixed(2)}</span>
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