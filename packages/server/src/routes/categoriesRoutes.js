import express from 'express';
import { allCategories, categoriesWithSubcategories, deletCategory, insertCategory, updateCategory, } from '../controllers/categoriesController.js';


const router = express.Router();

// GET /availableCategories?from_date=2025-01-01&to_date=2025-01-15
router.get('/subcategories', categoriesWithSubcategories)
router.get('/all-categories', allCategories)
router.post('/create-categories', insertCategory)
router.put('/category/:id', updateCategory)
router.delete('/category/:id', deletCategory)




export default router;