import React, { useState } from 'react';

// Product data structure representing all details of a product
interface Product {
  id: string;        // Unique identifier for tracking the product
  name: string;      // Product's display name
  price: number;     // Selling price of the product
  stock: number;     // Current inventory quantity
  category: string;  // Classification or type of product
  description: string; // Detailed explanation of the product
  image: string;     // URL or base64 representation of product image
}

// Props required to render the product details modal
interface ProductDetailsModalProps {
  product: Product;  // The specific product to display in detail
  onClose: () => void; // Callback function to dismiss the modal
}

// Modal component for displaying comprehensive product information
const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, onClose }) => {
  // Manages the closing animation state for mobile view
  const [isClosing, setIsClosing] = useState(false);

  // Handles modal closure with a smooth exit animation
  const handleClose = () => {
    setIsClosing(true);
    // Delay actual closure to allow animation to complete
    setTimeout(onClose, 300);
  };

  return (
    <>
      {/* Desktop view - hidden on mobile screens */}
      <div className="hidden md:fixed md:inset-0 md:z-50 md:flex md:items-center md:justify-center md:bg-black md:bg-opacity-50">
        {/* Desktop modal container with white background */}
        <div className="bg-white rounded-lg shadow-xl p-6 w-[32rem] max-h-[90vh] overflow-y-auto">
          {/* Modal header with title and close button */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Product Details</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Full-width product image display */}
          <div className="mb-6 w-full flex justify-center">
            <img 
              src={product.image} 
              alt={`Image of ${product.name}`} 
              className="max-w-full h-64 object-cover rounded-lg shadow-md"
            />
          </div>

          {/* Comprehensive product information section */}
          <div className="space-y-4">
            {/* Product identification */}
            <div>
              <p className="text-sm font-medium text-gray-600">Product ID</p>
              <p className="text-gray-900">{product.id}</p>
            </div>

            {/* Product naming details */}
            <div>
              <p className="text-sm font-medium text-gray-600">Name</p>
              <p className="text-gray-900 break-words">{product.name}</p>
            </div>

            {/* Product categorization */}
            <div>
              <p className="text-sm font-medium text-gray-600">Category</p>
              <p className="text-gray-900 break-words">{product.category}</p>
            </div>

            {/* Pricing information */}
            <div>
              <p className="text-sm font-medium text-gray-600">Price</p>
              <p className="text-gray-900">${product.price.toFixed(2)}</p>
            </div>

            {/* Inventory status */}
            <div>
              <p className="text-sm font-medium text-gray-600">Stock</p>
              <p className="text-gray-900">{product.stock}</p>
            </div>

            {/* Detailed product description */}
            <div>
              <p className="text-sm font-medium text-gray-600">Description</p>
              <p className="text-gray-900 break-words whitespace-pre-wrap">{product.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile view - full-screen modal with slide-up animation */}
      <div className={`md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 
        ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}
        flex items-end sm:items-center justify-center`}
      >
        {/* Mobile modal container with rounded corners */}
        <div className={`
          w-full bg-white rounded-t-xl sm:rounded-lg 
          ${isClosing ? 'animate-slide-down' : 'animate-slide-up'}
          sm:max-w-lg 
          max-h-[90vh]
          overflow-y-auto`}
        >
          {/* Mobile modal header with close button */}
          <div className="p-4 border-b relative flex justify-between items-center">
            <button 
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold text-gray-800 text-center">Product Details</h2>
            <div></div>
          </div>

          {/* Mobile product image display */}
          <div className="mb-4 w-full flex justify-center p-4">
            <img 
              src={product.image} 
              alt={`Image of ${product.name}`} 
              className="max-w-full h-64 object-cover rounded-lg shadow-md"
            />
          </div>

          {/* Mobile product information section with compact styling */}
          <div className="space-y-4 p-4">
            {/* Product ID for mobile */}
            <div>
              <p className="text-xs font-medium text-gray-600">Product ID</p>
              <p className="text-sm text-gray-900">{product.id}</p>
            </div>

            {/* Product name for mobile */}
            <div>
              <p className="text-xs font-medium text-gray-600">Name</p>
              <p className="text-sm text-gray-900 break-words">{product.name}</p>
            </div>

            {/* Product category for mobile */}
            <div>
              <p className="text-xs font-medium text-gray-600">Category</p>
              <p className="text-sm text-gray-900 break-words">{product.category}</p>
            </div>

            {/* Pricing for mobile */}
            <div>
              <p className="text-xs font-medium text-gray-600">Price</p>
              <p className="text-sm text-gray-900">${product.price.toFixed(2)}</p>
            </div>

            {/* Stock quantity for mobile */}
            <div>
              <p className="text-xs font-medium text-gray-600">Stock</p>
              <p className="text-sm text-gray-900">{product.stock}</p>
            </div>

            {/* Product description for mobile */}
            <div>
              <p className="text-xs font-medium text-gray-600">Description</p>
              <p className="text-sm text-gray-900 break-words whitespace-pre-wrap">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailsModal;
