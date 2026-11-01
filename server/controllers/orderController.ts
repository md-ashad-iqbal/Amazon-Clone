import { Request, Response } from 'express';
import { isDbConnected } from '../config/db';
import { OrderModel } from '../models/Order';
import { ProductModel } from '../models/Product';
import { inMemoryStore, StoreOrder } from '../store/inMemoryStore';

const FREE_DELIVERY_THRESHOLD = 499;
const FLAT_DELIVERY_CHARGE = 49;

export async function createOrder(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized. Please log in.' });
      return;
    }

    const { items, shippingAddress, paymentMethod = 'COD' } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, message: 'Order must contain at least one item.' });
      return;
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode) {
      res.status(400).json({ success: false, message: 'Incomplete shipping address provided.' });
      return;
    }

    // SERVER-SIDE PRICE AND STOCK VERIFICATION
    let verifiedSubtotal = 0;
    let verifiedSavings = 0;
    let maxDeliveryDays = 1;
    const verifiedItems = [];

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity < 1) {
        res.status(400).json({ success: false, message: 'Invalid item data in cart.' });
        return;
      }

      let product;
      if (isDbConnected()) {
        product = await ProductModel.findOne({ id: item.productId });
      } else {
        product = inMemoryStore.getProductById(item.productId);
      }

      if (!product) {
        res.status(400).json({ success: false, message: `Product not found: ${item.productId}` });
        return;
      }

      if (product.stock < item.quantity) {
        res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`,
        });
        return;
      }

      const itemTotal = product.price * item.quantity;
      const itemSavings = (product.originalPrice - product.price) * item.quantity;

      verifiedSubtotal += itemTotal;
      verifiedSavings += itemSavings;
      maxDeliveryDays = Math.max(maxDeliveryDays, product.deliveryDays || 3);

      verifiedItems.push({
        productId: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        quantity: item.quantity,
        image: product.images[0] || '',
      });
    }

    // Delivery calculation
    const deliveryCharge = verifiedSubtotal >= FREE_DELIVERY_THRESHOLD ? 0 : FLAT_DELIVERY_CHARGE;
    const total = verifiedSubtotal + deliveryCharge;

    // Delivery date calculation
    const deliveryDateObj = new Date(Date.now() + maxDeliveryDays * 86400000);
    const estimatedDeliveryDate = deliveryDateObj.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Decrement stock safely
    for (const item of verifiedItems) {
      if (isDbConnected()) {
        await ProductModel.findOneAndUpdate({ id: item.productId }, { $inc: { stock: -item.quantity } });
      } else {
        inMemoryStore.updateProductStock(item.productId, -item.quantity);
      }
    }

    if (isDbConnected()) {
      const order = await OrderModel.create({
        orderId,
        userId,
        items: verifiedItems,
        shippingAddress: {
          fullName: shippingAddress.fullName,
          phone: shippingAddress.phone || '',
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state || '',
          postalCode: shippingAddress.postalCode,
        },
        paymentMethod: paymentMethod === 'TEST_CHECKOUT' ? 'TEST_CHECKOUT' : 'COD',
        paymentStatus: paymentMethod === 'TEST_CHECKOUT' ? 'Completed' : 'Pending',
        subtotal: verifiedSubtotal,
        deliveryCharge,
        savings: verifiedSavings,
        total,
        status: 'Processing',
        estimatedDeliveryDate,
      });

      res.status(201).json({
        success: true,
        message: 'Order created successfully (Simulated)',
        order,
      });
    } else {
      const order = inMemoryStore.createOrder({
        orderId,
        userId,
        items: verifiedItems,
        shippingAddress: {
          fullName: shippingAddress.fullName,
          phone: shippingAddress.phone || '',
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state || '',
          postalCode: shippingAddress.postalCode,
        },
        paymentMethod: paymentMethod === 'TEST_CHECKOUT' ? 'TEST_CHECKOUT' : 'COD',
        paymentStatus: paymentMethod === 'TEST_CHECKOUT' ? 'Completed' : 'Pending',
        subtotal: verifiedSubtotal,
        deliveryCharge,
        savings: verifiedSavings,
        total,
        status: 'Processing',
        estimatedDeliveryDate,
      });

      res.status(201).json({
        success: true,
        message: 'Order created successfully (Simulated)',
        order,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function getMyOrders(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    if (isDbConnected()) {
      const orders = await OrderModel.find({ userId }).sort({ createdAt: -1 }).lean();
      res.json({ success: true, orders });
    } else {
      const orders = inMemoryStore.getOrdersByUserId(userId);
      res.json({ success: true, orders });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function getOrderById(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    const { orderId } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    let order: any = null;
    if (isDbConnected()) {
      order = await OrderModel.findOne({ orderId }).lean();
    } else {
      order = inMemoryStore.getOrderByOrderId(orderId);
    }

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    // Ownership check: User can only view their own orders!
    if (order.userId !== userId && req.user?.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Access denied. You cannot view this order.' });
      return;
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function cancelOrder(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    const { orderId } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    let order: any = null;
    if (isDbConnected()) {
      order = await OrderModel.findOne({ orderId });
    } else {
      order = inMemoryStore.getOrderByOrderId(orderId);
    }

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    if (order.userId !== userId && req.user?.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Access denied.' });
      return;
    }

    if (order.status !== 'Processing') {
      res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is already "${order.status}".`,
      });
      return;
    }

    // Restock items
    for (const item of order.items) {
      if (isDbConnected()) {
        await ProductModel.findOneAndUpdate({ id: item.productId }, { $inc: { stock: item.quantity } });
      } else {
        inMemoryStore.updateProductStock(item.productId, item.quantity);
      }
    }

    if (isDbConnected()) {
      order.status = 'Cancelled';
      await order.save();
    } else {
      inMemoryStore.updateOrderStatus(orderId, 'Cancelled');
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully. Stock has been restored.',
      order: { ...order, status: 'Cancelled' },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}
