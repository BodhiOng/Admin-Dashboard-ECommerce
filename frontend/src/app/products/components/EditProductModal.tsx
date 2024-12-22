import React, { useState, useEffect } from 'react';

// Interface defining the structure of a product without an ID
interface Product {
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  image: string;
}

// Props interface for the EditProductModal component
interface EditProductModalProps {
  // The selected product being edited
  selectedProduct: Product;
  // The original product for comparison
  originalProduct: Product;
  // Handler for input changes in the form
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { 
    target: { 
      name: string; 
      value: string | number
    } 
  }) => void;
  // Handler to update the product
  onUpdateProduct: () => void;
  // Handler to close the modal
  onClose: () => void;
}

// EditProductModal component for editing existing products
const EditProductModal: React.FC<EditProductModalProps> = ({ 
  selectedProduct, 
  originalProduct,
  onInputChange, 
  onUpdateProduct, 
  onClose 
}) => {
  // State to manage image preview
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Set initial image preview when component mounts or selectedProduct changes
  useEffect(() => {
    if (selectedProduct.image) {
      setImagePreview(selectedProduct.image);
    }
  }, [selectedProduct]);

  // Handler for image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Update the product image
      onInputChange({ 
        target: { 
          name: 'image', 
          value: URL.createObjectURL(file) 
        } 
      });
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="p-6 border-b relative">
          <h2 className="text-xl font-semibold text-gray-800">Edit Product</h2>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
        </div>
        <form className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                name="name"
                value={selectedProduct.name}
                onChange={onInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                name="price"
                value={selectedProduct.price}
                onChange={onInputChange}
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock</label>
              <input
                type="number"
                name="stock"
                value={selectedProduct.stock}
                onChange={onInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                name="category"
                value={selectedProduct.category}
                onChange={onInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={selectedProduct.description}
              onChange={onInputChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Image</label>
            {!imagePreview && (
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-gray-600">
                    <label 
                      htmlFor="file-upload" 
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input 
                        id="file-upload" 
                        name="image" 
                        type="file" 
                        className="sr-only" 
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            )}
            {imagePreview && (
              <div className="mt-4 relative">
                <img 
                  src={imagePreview} 
                  alt="Product Preview" 
                  className="mx-auto h-32 object-contain"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    onInputChange({ 
                      target: { 
                        name: 'image', 
                        value: '' 
                      } 
                    });
                  }}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onUpdateProduct}
              disabled={
                selectedProduct.name === originalProduct.name &&
                selectedProduct.price === originalProduct.price &&
                selectedProduct.stock === originalProduct.stock &&
                selectedProduct.category === originalProduct.category &&
                selectedProduct.description === originalProduct.description &&
                selectedProduct.image === originalProduct.image
              }
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedProduct.name === originalProduct.name &&
                selectedProduct.price === originalProduct.price &&
                selectedProduct.stock === originalProduct.stock &&
                selectedProduct.category === originalProduct.category &&
                selectedProduct.description === originalProduct.description &&
                selectedProduct.image === originalProduct.image
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
