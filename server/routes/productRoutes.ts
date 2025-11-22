// Example of completed server/routes/productRoutes.ts

import { Router } from 'express';
import { 
    createProduct, 
    getProducts, 
    createTransaction 
} from '../controllers/productController';

const router = Router();

// CRUD for Products
router.post('/', createProduct);
router.get('/', getProducts);
// router.put('/:id', updateProduct); // You may need this too

// CRITICAL DYNAMIC ROUTE
router.post('/transactions', createTransaction); 

export default router;