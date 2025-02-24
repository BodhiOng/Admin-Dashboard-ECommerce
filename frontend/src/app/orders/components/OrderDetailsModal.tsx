"use client";

import React, { useState } from 'react';

// Order interface to match the one in page.tsx
interface Order {
  id: string;
  customer: string;
  date: string;
  status: string;
  total: number;
  products: {
    productId: string;
    name: string;
    quantity: number;
  }[];
}

// Props interface for OrderDetailsModal
interface OrderDetailsModalProps {
  specificOrder: Order;
  onClose: () => void;
}

// OrderDetailsModal component for displaying detailed order information
const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ specificOrder, onClose }) => {
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
        <div className="bg-white rounded-lg shadow-xl p-6 w-[32rem] max-h-[90vh] overflow-y-auto">
          {/* Modal header with title and close button */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Comprehensive order information section */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Order Number</p>
              <p className="text-gray-900">{specificOrder.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Customer</p>
              <p className="text-gray-900">{specificOrder.customer}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Date</p>
              <p className="text-gray-900">{specificOrder.date}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-gray-900">${specificOrder.total.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Status</p>
              <p className="text-gray-900">{specificOrder.status.charAt(0).toUpperCase() + specificOrder.status.slice(1).toLowerCase()}</p>
            </div>

            {/* Products Section */}
            <div>
              <p className="text-sm font-medium text-gray-600">Products</p>
              <div className="space-y-2">
                {specificOrder.products.map((product, index) => (
                  <div key={product.productId} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                    <div>
                      <p className="text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">Product ID: {product.productId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-900">Qty: {product.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
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
            <h2 className="text-lg font-semibold text-gray-800 text-center">Order Details</h2>
            <div></div>
          </div>

          {/* Mobile order information section with compact styling */}
          <div className="space-y-4 p-4">
            <div>
              <p className="text-xs font-medium text-gray-600">Order Number</p>
              <p className="text-sm text-gray-900">{specificOrder.id}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">Customer</p>
              <p className="text-sm text-gray-900">{specificOrder.customer}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">Date</p>
              <p className="text-sm text-gray-900">{specificOrder.date}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">Total</p>
              <p className="text-sm text-gray-900">${specificOrder.total.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">Status</p>
              <p className="text-sm text-gray-900">{specificOrder.status.charAt(0).toUpperCase() + specificOrder.status.slice(1).toLowerCase()}</p>
            </div>

            {/* Mobile Products Section */}
            <div>
              <p className="text-xs font-medium text-gray-600">Products</p>
              <div className="space-y-2">
                {specificOrder.products.map((product, index) => (
                  <div key={product.productId} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                    <div>
                      <p className="text-sm text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">Product ID: {product.productId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900">Qty: {product.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsModal;