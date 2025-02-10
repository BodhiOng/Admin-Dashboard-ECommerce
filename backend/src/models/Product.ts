import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

// Function to read default image as base64
function getDefaultImageBase64(): string {
  try {
    const imagePath = path.join(__dirname, '..', '..', 'public', 'No_Image_Available.jpg');
    const imageBuffer = fs.readFileSync(imagePath);
    return `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
  } catch (error) {
    console.error('Error reading default image:', error);
    return ''; // Fallback to empty string if image can't be read
  }
}

export interface IProduct extends Document {
  _id: string;  
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

const ProductSchema: Schema = new Schema<IProduct>(
  {
    _id: { 
      type: String,
      default: () => `PRODUCT-${uuidv4()}`,
      required: true
    },
    id: { 
      type: String,
      default: () => `PRODUCT-${uuidv4()}`,
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
      default: getDefaultImageBase64
    }
  }, 
  {
    timestamps: true,
    versionKey: '__v'
  }
);

const Product = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
