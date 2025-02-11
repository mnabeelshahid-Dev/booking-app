import express from 'express';
import { allHotels } from '../controllers/homes_categoryController.js';



const router = express.Router();

// GET /all-homes
router.get('/all-hotels', allHotels)




export default router;