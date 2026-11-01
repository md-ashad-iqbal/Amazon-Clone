import { Router } from 'express';
import { getAddresses, addAddress, updateAddress, deleteAddress } from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/addresses', authMiddleware, getAddresses);
router.post('/addresses', authMiddleware, addAddress);
router.put('/addresses/:addressId', authMiddleware, updateAddress);
router.delete('/addresses/:addressId', authMiddleware, deleteAddress);

export default router;
