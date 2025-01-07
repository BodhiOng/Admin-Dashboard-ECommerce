import mongoose, { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IProduct extends Document {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema = new mongoose.Schema<IProduct>(
  {
    id: { 
      type: String,
      default: uuidv4,
      required: true
    },
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    description: { 
      type: String, 
      required: true,
      trim: true 
    },
    price: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    category: { 
      type: String, 
      required: true 
    },
    stock: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    image: { 
      type: String, 
      required: true,
      trim: true,
      default: 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
    }
  }, 
  {
    timestamps: true,
    versionKey: '__v'  // Explicitly enable version key
  }
);

// Ensure _id is used as the primary key
ProductSchema.set('toJSON', {
  transform: function(doc, ret) {
    // Keep both _id and id with the same value
    ret.id = ret._id;
    return ret;
  }
});

const Product = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
