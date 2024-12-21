import React from 'react';

// Interface defining the complete structure of a product
interface Product {
  id: string;        // Unique identifier for the product
  name: string;      // Name of the product
  price: number;     // Price of the product
  stock: number;     // Current stock quantity
  category: string;  // Product category
  description: string; // Product description
  image: string;     // Product image URL or base64 string
}

// Props interface for the ProductDetailsModal component
interface ProductDetailsModalProps {
  // The specific product to display details for
  product: Product;
  // Handler to close the modal
  onClose: () => void;
}

// ProductDetailsModal component for displaying detailed product information
const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, onClose }) => {
  return (
    // Full-screen modal overlay with semi-transparent background
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal container with white background and rounded corners */}
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

        {/* Product Image */}
        <div className="mb-6 w-full flex justify-center">
          <img 
            src={product.image} 
            alt={`Image of ${product.name}`} 
            className="max-w-full h-64 object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Detailed product information display */}
        <div className="space-y-4">
          {/* Product ID */}
          <div>
            <p className="text-sm font-medium text-gray-600">Product ID</p>
            <p className="text-gray-900">{product.id}</p>
          </div>

          {/* Product Name */}
          <div>
            <p className="text-sm font-medium text-gray-600">Name</p>
            <p className="text-gray-900 break-words">{product.name}</p>
          </div>

          {/* Product Category */}
          <div>
            <p className="text-sm font-medium text-gray-600">Category</p>
            <p className="text-gray-900 break-words">{product.category}</p>
          </div>

          {/* Product Price (formatted to two decimal places) */}
          <div>
            <p className="text-sm font-medium text-gray-600">Price</p>
            <p className="text-gray-900">${product.price.toFixed(2)}</p>
          </div>

          {/* Product Stock Quantity */}
          <div>
            <p className="text-sm font-medium text-gray-600">Stock</p>
            <p className="text-gray-900">{product.stock}</p>
          </div>

          {/* Product Description */}
          <div>
            <p className="text-sm font-medium text-gray-600">Description</p>
            <p className="text-gray-900 break-words whitespace-pre-wrap">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
