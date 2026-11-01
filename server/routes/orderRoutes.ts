import { Router } from 'express';
import { createOrder, getMyOrders, getOrderById, cancelOrder } from '../controllers/orderController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, createOrder);
router.get('/', authMiddleware, getMyOrders);
router.get('/:orderId', authMiddleware, getOrderById);
router.put('/:orderId/cancel', authMiddleware, cancelOrder);

export default router;
