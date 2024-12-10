"use client";

import React from 'react';

interface OrderDetailsProps {
  order: {
    _id: string;
    customer: {
      name: string;
    };
    status: string;
  };
  onClose: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onClose }) => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Order Details</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
          Close
        </button>
      </div>
      <div className="space-y-4">
        <div className="border p-4 rounded-lg">
          <h3 className="font-medium mb-2">Order Information</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Order ID:</span> {order._id}</p>
            <p><span className="font-medium">Customer:</span> {order.customer.name}</p>
            <p><span className="font-medium">Status:</span> {order.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
