import { Router } from 'express';
import {
  getProducts,
  getProductById,
  getCategories,
  getBrands,
  getSuggestions,
  getRelatedProducts,
} from '../controllers/productController';

const router = Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/brands', getBrands);
router.get('/suggestions', getSuggestions);
router.get('/:id', getProductById);
router.get('/:id/related', getRelatedProducts);

export default router;
