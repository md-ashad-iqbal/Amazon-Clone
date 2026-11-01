import bcrypt from 'bcryptjs';
import { INITIAL_PRODUCTS, ProductData } from '../data/initialProducts';

export interface StoreAddress {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

export interface StoreUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'customer' | 'admin';
  addresses: StoreAddress[];
  createdAt: string;
}

export interface StoreOrderItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  quantity: number;
  image: string;
}

export interface StoreOrder {
  id: string;
  orderId: string;
  userId: string;
  items: StoreOrderItem[];
  shippingAddress: Omit<StoreAddress, 'id' | 'isDefault'>;
  paymentMethod: 'COD' | 'TEST_CHECKOUT';
  paymentStatus: 'Pending' | 'Completed';
  subtotal: number;
  deliveryCharge: number;
  savings: number;
  total: number;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  estimatedDeliveryDate: string;
  createdAt: string;
}

class InMemoryStore {
  private users: Map<string, StoreUser> = new Map();
  private products: Map<string, ProductData> = new Map();
  private orders: Map<string, StoreOrder> = new Map();
  private initialized = false;

  constructor() {
    this.seed();
  }

  private seed() {
    if (this.initialized) return;

    // Seed products
    INITIAL_PRODUCTS.forEach((product) => {
      this.products.set(product.id, { ...product });
    });

    // Seed default demo user
    const salt = bcrypt.genSaltSync(10);
    const demoPasswordHash = bcrypt.hashSync('demo12345', salt);
    const demoUserId = 'usr_demo_001';

    const demoUser: StoreUser = {
      id: demoUserId,
      name: 'Ashad Iqbal',
      email: 'demo@shopsphere.com',
      passwordHash: demoPasswordHash,
      role: 'customer',
      addresses: [
        {
          id: 'addr_001',
          fullName: 'Ashad Iqbal',
          phone: '+91 98765 43210',
          street: '42 Marine Drive, Nariman Point',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400021',
          isDefault: true,
        },
        {
          id: 'addr_002',
          fullName: 'Ashad Iqbal (Office)',
          phone: '+91 98765 43211',
          street: 'Building 7, Mindspace IT Park, Hitec City',
          city: 'Hyderabad',
          state: 'Telangana',
          postalCode: '500081',
          isDefault: false,
        },
      ],
      createdAt: new Date().toISOString(),
    };

    this.users.set(demoUserId, demoUser);

    // Seed sample order for demo user
    const sampleProduct1 = INITIAL_PRODUCTS[0];
    const sampleProduct2 = INITIAL_PRODUCTS[2];
    const sampleOrder: StoreOrder = {
      id: 'ord_sample_001',
      orderId: 'ORD-20261101-8842',
      userId: demoUserId,
      items: [
        {
          productId: sampleProduct1.id,
          name: sampleProduct1.name,
          brand: sampleProduct1.brand,
          price: sampleProduct1.price,
          originalPrice: sampleProduct1.originalPrice,
          quantity: 1,
          image: sampleProduct1.images[0],
        },
        {
          productId: sampleProduct2.id,
          name: sampleProduct2.name,
          brand: sampleProduct2.brand,
          price: sampleProduct2.price,
          originalPrice: sampleProduct2.originalPrice,
          quantity: 1,
          image: sampleProduct2.images[0],
        },
      ],
      shippingAddress: {
        fullName: demoUser.addresses[0].fullName,
        phone: demoUser.addresses[0].phone,
        street: demoUser.addresses[0].street,
        city: demoUser.addresses[0].city,
        state: demoUser.addresses[0].state,
        postalCode: demoUser.addresses[0].postalCode,
      },
      paymentMethod: 'COD',
      paymentStatus: 'Pending',
      subtotal: sampleProduct1.price + sampleProduct2.price,
      deliveryCharge: 0,
      savings: (sampleProduct1.originalPrice - sampleProduct1.price) + (sampleProduct2.originalPrice - sampleProduct2.price),
      total: sampleProduct1.price + sampleProduct2.price,
      status: 'Processing',
      estimatedDeliveryDate: new Date(Date.now() + 3 * 86400000).toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    };

    this.orders.set(sampleOrder.orderId, sampleOrder);
    this.initialized = true;
  }

  // User Operations
  getUserByEmail(email: string): StoreUser | undefined {
    const cleanEmail = email.toLowerCase().trim();
    return Array.from(this.users.values()).find((u) => u.email.toLowerCase() === cleanEmail);
  }

  getUserById(id: string): StoreUser | undefined {
    return this.users.get(id);
  }

  createUser(user: Omit<StoreUser, 'id' | 'createdAt'>): StoreUser {
    const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newUser: StoreUser = {
      ...user,
      id,
      createdAt: new Date().toISOString(),
    };
    this.users.set(id, newUser);
    return newUser;
  }

  updateUser(id: string, updates: Partial<StoreUser>): StoreUser | undefined {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...updates };
    this.users.set(id, updated);
    return updated;
  }

  // Address Operations
  addAddress(userId: string, address: Omit<StoreAddress, 'id'>): StoreAddress | undefined {
    const user = this.users.get(userId);
    if (!user) return undefined;

    const id = `addr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newAddress: StoreAddress = { ...address, id };

    if (newAddress.isDefault) {
      user.addresses.forEach((a) => {
        a.isDefault = false;
      });
    } else if (user.addresses.length === 0) {
      newAddress.isDefault = true;
    }

    user.addresses.push(newAddress);
    return newAddress;
  }

  updateAddress(userId: string, addressId: string, updates: Partial<StoreAddress>): StoreAddress | undefined {
    const user = this.users.get(userId);
    if (!user) return undefined;

    const index = user.addresses.findIndex((a) => a.id === addressId);
    if (index === -1) return undefined;

    if (updates.isDefault) {
      user.addresses.forEach((a) => {
        a.isDefault = false;
      });
    }

    user.addresses[index] = { ...user.addresses[index], ...updates };
    return user.addresses[index];
  }

  deleteAddress(userId: string, addressId: string): boolean {
    const user = this.users.get(userId);
    if (!user) return false;

    const initialLen = user.addresses.length;
    user.addresses = user.addresses.filter((a) => a.id !== addressId);
    if (user.addresses.length > 0 && !user.addresses.some((a) => a.isDefault)) {
      user.addresses[0].isDefault = true;
    }
    return user.addresses.length < initialLen;
  }

  // Product Operations
  getAllProducts(): ProductData[] {
    return Array.from(this.products.values());
  }

  getProductById(id: string): ProductData | undefined {
    return this.products.get(id);
  }

  updateProductStock(id: string, delta: number): boolean {
    const product = this.products.get(id);
    if (!product) return false;
    if (product.stock + delta < 0) return false;
    product.stock += delta;
    return true;
  }

  // Order Operations
  createOrder(orderData: Omit<StoreOrder, 'id' | 'createdAt'>): StoreOrder {
    const id = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newOrder: StoreOrder = {
      ...orderData,
      id,
      createdAt: new Date().toISOString(),
    };
    this.orders.set(newOrder.orderId, newOrder);
    return newOrder;
  }

  getOrdersByUserId(userId: string): StoreOrder[] {
    return Array.from(this.orders.values())
      .filter((o) => o.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getOrderByOrderId(orderId: string): StoreOrder | undefined {
    return this.orders.get(orderId);
  }

  updateOrderStatus(orderId: string, status: StoreOrder['status']): StoreOrder | undefined {
    const order = this.orders.get(orderId);
    if (!order) return undefined;
    order.status = status;
    return order;
  }
}

export const inMemoryStore = new InMemoryStore();
