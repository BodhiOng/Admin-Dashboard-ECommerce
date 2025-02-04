import mongoose, { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

interface OrderProduct {
  product_name: string;
  product_id: string;
  product_quantity: number;
}

interface IOrder extends Document {
  _id: string;
  id: string;
  customer: string;
  date: string;
  total: number;
  status: string;
  products: OrderProduct[];
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderSchema = new mongoose.Schema<IOrder>({
  _id: {
    type: String,
    required: true,
    default: () => `ORDER-${uuidv4()}`
  },
  id: {
    type: String,
    required: true,
    default: () => `ORDER-${uuidv4()}`
  },
  customer: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    required: true
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Processing', 'Completed'],
    default: 'Pending'
  },
  products: [{
    product_name: {
      type: String,
      required: true
    },
    product_id: {
      type: String,
      required: true
    },
    product_quantity: {
      type: Number,
      required: true,
      min: 0
    }
  }]
}, {
  timestamps: true,
  versionKey: '__v'
});

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
