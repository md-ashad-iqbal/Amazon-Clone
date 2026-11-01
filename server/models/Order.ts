import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  quantity: number;
  image: string;
}

export interface IOrderAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface IOrder extends Document {
  orderId: string;
  userId: string;
  items: IOrderItem[];
  shippingAddress: IOrderAddress;
  paymentMethod: 'COD' | 'TEST_CHECKOUT';
  paymentStatus: 'Pending' | 'Completed';
  subtotal: number;
  deliveryCharge: number;
  savings: number;
  total: number;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  estimatedDeliveryDate: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, required: true },
});

const OrderAddressSchema = new Schema<IOrderAddress>({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    items: [OrderItemSchema],
    shippingAddress: { type: OrderAddressSchema, required: true },
    paymentMethod: { type: String, enum: ['COD', 'TEST_CHECKOUT'], default: 'COD' },
    paymentStatus: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
    subtotal: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true },
    savings: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Processing',
    },
    estimatedDeliveryDate: { type: String, required: true },
  },
  { timestamps: true }
);

export const OrderModel = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
