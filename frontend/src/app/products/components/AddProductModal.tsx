import React from 'react';

// Interface defining the structure of a product without an ID
interface Product {
  name: string;
  price: number;
  stock: number;
  category: string;
}

// Props interface for the AddProductModal component
interface AddProductModalProps {
  // The new product being created
  newProduct: Product;
  // Handler for input changes in the form
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // Handler to add the new product
  onAddProduct: () => void;
  // Handler to close the modal
  onClose: () => void;
}

// AddProductModal component for creating new products
const AddProductModal: React.FC<AddProductModalProps> = ({ 
  newProduct, 
  onInputChange, 
  onAddProduct, 
  onClose 
}) => {
  // Check if all fields are filled
  const isFormValid = 
    newProduct.name.trim() !== '' && 
    newProduct.price > 0 && 
    newProduct.stock >= 0 && 
    newProduct.category.trim() !== '';

  return (
    // Full-screen modal overlay with semi-transparent background
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal container with white background and rounded corners */}
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        {/* Modal header with title and close button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Product</h2>
          {/* Close button */}
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Form for adding a new product */}
        <div className="space-y-4">
          {/* Product Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={onInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter product name"
              maxLength={50}  // Limit product name to 50 characters
              required  // Ensure the field is not left empty
            />
          </div>

          {/* Price Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={newProduct.price}
              onChange={onInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter price"
              step="0.01"
              min="0"
              required  // Ensure the field is not left empty
            />
          </div>

          {/* Stock Quantity Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              name="stock"
              value={newProduct.stock}
              onChange={onInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter stock quantity"
              min="0"
              required  // Ensure the field is not left empty
            />
          </div>

          {/* Category Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              name="category"
              value={newProduct.category}
              onChange={onInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter category"
              maxLength={30}  // Limit category to 30 characters
              required  // Ensure the field is not left empty
            />
          </div>

          {/* Action buttons for canceling or adding the product */}
          <div className="flex justify-end space-x-3 mt-6">
            {/* Cancel button */}
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            {/* Add Product button */}
            <button
              onClick={onAddProduct}
              disabled={!isFormValid}
              className={`px-4 py-2 rounded-md ${
                isFormValid 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Add Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
