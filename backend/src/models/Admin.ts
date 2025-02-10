import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

// Function to read default image as base64
function getDefaultAdminProfilePicture(): string {
  try {
    const imagePath = path.join(__dirname, '..', '..', 'public', '2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg');
    const imageBuffer = fs.readFileSync(imagePath);
    return `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
  } catch (error) {
    console.error('Error reading default admin profile picture:', error);
    return ''; // Fallback to empty string if image can't be read
  }
}

export interface IAdmin extends Document {
  _id: string;
  id: string;
  username: string;
  email: string;
  phone_number: string;
  role: string;
  first_name: string;
  last_name: string;
  address: string;
  password: string;
  profile_picture?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const AdminSchema: Schema = new Schema<IAdmin>({
  _id: {
    type: String,
    required: true,
    default: () => `ADMIN-${uuidv4()}`
  },
  id: {
    type: String,
    required: true,
    default: () => `ADMIN-${uuidv4()}`
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone_number: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true,
    default: 'Current Admin'
  },
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  profile_picture: {
    type: String,
    default: getDefaultAdminProfilePicture
  },
}, {
  timestamps: true,
  versionKey: '__v'
});

const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);

export default Admin;
