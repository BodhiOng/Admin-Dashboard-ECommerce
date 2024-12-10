"use client";

import { useState } from 'react';

// Mock data
const mockProducts = [
  {
    id: 1,
    name: 'Wireless Mouse',
    price: 29.99,
    description: 'High-performance wireless mouse with ergonomic design',
    image: 'https://placehold.co/100x100',
    stock: 45,
    category: 'Electronics'
  },
  {
    id: 2,
    name: 'Mechanical Keyboard',
    price: 89.99,
    description: 'RGB mechanical keyboard with Cherry MX switches',
    image: 'https://placehold.co/100x100',
    stock: 30,
    category: 'Electronics'
  },
  {
    id: 3,
    name: 'Gaming Headset',
    price: 59.99,
    description: '7.1 surround sound gaming headset with noise cancellation',
    image: 'https://placehold.co/100x100',
    stock: 20,
    category: 'Electronics'
  },
];

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  category: string;
}

const ProductImage = ({ src }: { src: string }) => {
  return (
    <img
      src={src}
      alt="Product"
      className="w-12 h-12 rounded-lg object-cover"
    />
  );
};

const StatusPill = ({ stock }: { stock: number }) => {
  const status = stock > 20 ? 'In Stock' : stock > 0 ? 'Low Stock' : 'Out of Stock';
  const colorClass = stock > 20 
    ? 'bg-green-100 text-green-800'
    : stock > 0
    ? 'bg-yellow-100 text-yellow-800'
    : 'bg-red-100 text-red-800';

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
      {status}
    </span>
  );
};

export default function Products() {
  const [products] = useState<Product[]>(mockProducts);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ProductImage src={product.image} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusPill stock={product.stock} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}