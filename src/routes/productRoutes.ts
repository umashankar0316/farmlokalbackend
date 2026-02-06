import { Router } from 'express';
import { getProducts } from '../controllers/ProductController';

const router = Router();

router.get('/', getProducts);

export default router;