import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller';
import { requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Publicly readable endpoints
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected Admin-only endpoints
router.post('/', requireAdmin, createProduct);
router.put('/:id', requireAdmin, updateProduct);
router.delete('/:id', requireAdmin, deleteProduct);

export default router;
