import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  stock: number;
  images: string[];
  description: string;
  specs: Record<string, string>;
  featured: boolean;
  bestSeller: boolean;
  deliveryDays: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    subcategory: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    images: [{ type: String }],
    description: { type: String, required: true },
    specs: { type: Map, of: String },
    featured: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    deliveryDays: { type: Number, default: 3 },
  },
  { timestamps: true }
);

export const ProductModel = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
