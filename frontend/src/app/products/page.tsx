"use client";

import { useState, useMemo } from 'react';
import { useTable, Column } from 'react-table';

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

function ProductImage({ value }: { value: string }) {
  return (
    <img
      src={value}
      alt="Product"
      className="w-12 h-12 rounded-lg object-cover"
    />
  );
}

function StatusPill({ value }: { value: number }) {
  const status = value > 20 ? 'In Stock' : value > 0 ? 'Low Stock' : 'Out of Stock';
  const colorClass = value > 20 
    ? 'bg-green-100 text-green-800'
    : value > 0
    ? 'bg-yellow-100 text-yellow-800'
    : 'bg-red-100 text-red-800';

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
      {status}
    </span>
  );
}

export default function Products() {
  const [data] = useState<Product[]>(mockProducts);
  
  const columns = useMemo<Column<Product>[]>(
    () => [
      {
        Header: 'Product',
        columns: [
          {
            Header: 'Image',
            accessor: 'image',
            Cell: ProductImage
          },
          {
            Header: 'Name',
            accessor: 'name',
          },
        ],
      },
      {
        Header: 'Details',
        columns: [
          {
            Header: 'Category',
            accessor: 'category',
          },
          {
            Header: 'Price',
            accessor: 'price',
            Cell: ({ value }: { value: number }) => `$${value.toFixed(2)}`
          },
          {
            Header: 'Stock',
            accessor: 'stock',
            Cell: StatusPill
          },
        ],
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

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
          <table {...getTableProps()} className="w-full">
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th
                      {...column.getHeaderProps()}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
              {rows.map(row => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="hover:bg-gray-50">
                    {row.cells.map(cell => (
                      <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap">
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}