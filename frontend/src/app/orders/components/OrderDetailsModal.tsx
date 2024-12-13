import React from 'react';

// Order interface to match the one in page.tsx
interface Order {
  _id: string;
  customer: {
    name: string;
  };
  orderNumber: string;
  date: string;
  status: string;
  total: number;
}

// Props interface for OrderDetailsModal
interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
}

// OrderDetailsModal component for displaying detailed order information
const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Order Number</p>
            <p className="text-gray-900">{order.orderNumber}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Customer</p>
            <p className="text-gray-900">{order.customer.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Date</p>
            <p className="text-gray-900">{order.date}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total</p>
            <p className="text-gray-900">${order.total.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Status</p>
            <p className="text-gray-900">{order.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;