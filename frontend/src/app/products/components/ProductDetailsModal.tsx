import React, { useState } from 'react';

// Interface of product
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  image: string;
}

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  // Convert base64 image to a valid data URL
  const convertBase64ToImage = (base64String: string) => {
    // Check if the string is already a valid URL or data URL
    if (base64String.startsWith('http') || base64String.startsWith('data:')) {
      return base64String;
    }

    // If it's a base64 string without a prefix, add the data URL prefix
    return `data:image/jpeg;base64,${base64String}`;
  };

  // Handles modal closure with a smooth exit animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  return (
    <>
      {/* Desktop view */}
      <div className="hidden md:fixed md:inset-0 md:z-50 md:flex md:items-center md:justify-center md:bg-black md:bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-[32rem] max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Product Details</h2>
            <button 
              onClick={handleClose} 
              className="text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
          </div>

          {/* Product image */}
          <div className="mb-6 w-full flex justify-center">
            <img 
              src={convertBase64ToImage(product.image)} 
              alt={product.name} 
              className="max-w-full max-h-64 object-contain"
            />
          </div>

          {/* Product information */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Product ID</p>
              <p className="text-gray-900">{product.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Name</p>
              <p className="text-gray-900 break-words">{product.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Category</p>
              <p className="text-gray-900 break-words">{product.category}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Price</p>
              <p className="text-gray-900">RM {product.price.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Stock</p>
              <p className="text-gray-900">{product.stock}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Description</p>
              <p className="text-gray-900 break-words whitespace-pre-wrap">{product.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile view */}
      <div className={`md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 
        ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}
        flex items-end sm:items-center justify-center`}
      >
        <div className={`
          w-full bg-white rounded-t-xl sm:rounded-lg 
          ${isClosing ? 'animate-slide-down' : 'animate-slide-up'}
          sm:max-w-lg 
          max-h-[90vh]
          overflow-y-auto`}
        >
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

          {/* Product image */}
          <div className="mb-4 w-full flex justify-center p-4">
            <img 
              src={convertBase64ToImage(product.image)} 
              alt={product.name} 
              className="max-w-full max-h-64 object-contain"
            />
          </div>

          {/* Product information */}
          <div className="space-y-4 p-4">
            <div>
              <p className="text-xs font-medium text-gray-600">Product ID</p>
              <p className="text-sm text-gray-900">{product.id}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">Name</p>
              <p className="text-sm text-gray-900 break-words">{product.name}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">Category</p>
              <p className="text-sm text-gray-900 break-words">{product.category}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">Price</p>
              <p className="text-sm text-gray-900">RM {product.price.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">Stock</p>
              <p className="text-sm text-gray-900">{product.stock}</p>
            </div>
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