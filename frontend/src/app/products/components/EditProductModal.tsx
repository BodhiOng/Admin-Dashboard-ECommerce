import React, { useState, useEffect } from 'react';

// Interface for a product
interface Product {
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  image: string;
}

interface EditProductModalProps {
  selectedProduct: Product;
  originalProduct: Product;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { 
    target: { 
      name: string; 
      value: string | number
    } 
  }) => void;
  onUpdateProduct: () => void;
  onClose: () => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ 
  selectedProduct, 
  originalProduct,
  onInputChange, 
  onUpdateProduct, 
  onClose 
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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

  // Modified close handler to trigger animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  // Set initial image preview when component mounts or selectedProduct changes
  useEffect(() => {
    if (selectedProduct.image) {
      setImagePreview(convertBase64ToImage(selectedProduct.image));
    }
  }, [selectedProduct]);

  // Handler for image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create image preview and convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        // Extract base64 string (remove data URL prefix if present)
        const base64String = (reader.result as string).replace(/^data:image\/\w+;base64,/, '');
        
        // Update the product image with base64
        onInputChange({ 
          target: { 
            name: 'image', 
            value: base64String 
          } 
        });
        
        // Set image preview (keep full data URL for display)
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Mobile View */}
      <div className={`md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 
        ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}
        flex items-end sm:items-center justify-center`}
      >
        <div className={`
          w-full bg-white rounded-t-xl sm:rounded-lg 
          ${isClosing ? 'animate-slide-down' : 'animate-slide-up'}
          sm:max-w-lg 
          max-h-[90vh]
          overflow-hidden`}
        >
          <div className="p-4 border-b relative">
            <h2 className="text-lg font-semibold text-gray-800 text-center">Edit Product</h2>
          </div>
          <form className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-100px)] pb-20">
            {/* Product Name */}
            <div>
              <label className="block text-xs font-medium text-gray-700">Product Name</label>
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
              <label className="block text-xs font-medium text-gray-700">Price</label>
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
              <label className="block text-xs font-medium text-gray-700">Stock</label>
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
              <label className="block text-xs font-medium text-gray-700">Category</label>
              <input
                type="text"
                name="category"
                value={selectedProduct.category}
                onChange={onInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-gray-700">Description</label>
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
              <label className="block text-xs font-medium text-gray-700">Product Image</label>
              <div 
                className="mt-1 flex justify-center px-4 border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
                onClick={() => {
                  const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                  fileInput.click();
                }}
              >
                <div 
                  className="space-y-1 text-center"
                >
                  <input
                    id="file-upload"
                    name="image"
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                  {!imagePreview && (
                    <>
                      <div className="flex text-sm text-gray-600">
                        <div className="relative bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                          <span>Upload a file</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </>
                  )}
                  {imagePreview && (
                    <div className="mt-4">
                      <img
                        src={convertBase64ToImage(imagePreview)}
                        alt="Product Preview"
                        className="mx-auto h-48 w-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="h-20"></div>
          </form>

          {/* Cancel/Update buttons */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md"
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
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md ${
                  selectedProduct.name === originalProduct.name &&
                  selectedProduct.price === originalProduct.price &&
                  selectedProduct.stock === originalProduct.stock &&
                  selectedProduct.category === originalProduct.category &&
                  selectedProduct.description === originalProduct.description &&
                  selectedProduct.image === originalProduct.image
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                Update Product
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block w-full max-w-2xl bg-white rounded-lg shadow-xl">
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
            <div 
              className="flex justify-center border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
              onClick={() => {
                const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                fileInput.click();
              }}
            >
              <div 
                className="space-y-1 text-center cursor-pointer"
              >
                <input 
                  id="file-upload" 
                  name="image" 
                  type="file" 
                  className="hidden" 
                  onChange={handleImageChange}
                  accept="image/*"
                />
                {!imagePreview && (
                  <>
                    <div className="flex text-sm text-gray-600">
                      <div className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                        <span>Upload a file</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </>
                )}
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={convertBase64ToImage(imagePreview)}
                      alt="Product Preview"
                      className="mx-auto h-48 w-full object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Update/cancel buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
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
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                selectedProduct.name === originalProduct.name &&
                selectedProduct.price === originalProduct.price &&
                selectedProduct.stock === originalProduct.stock &&
                selectedProduct.category === originalProduct.category &&
                selectedProduct.description === originalProduct.description &&
                selectedProduct.image === originalProduct.image
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
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
