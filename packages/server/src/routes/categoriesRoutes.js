import express from 'express';
import { allCategories, categoriesWithSubcategories, } from '../controllers/categoriesController.js';


const router = express.Router();

// GET /availableCategories?from_date=2025-01-01&to_date=2025-01-15
router.get('/categories_with_subcategories', categoriesWithSubcategories)
router.get('/all-categories', allCategories)




export default router;