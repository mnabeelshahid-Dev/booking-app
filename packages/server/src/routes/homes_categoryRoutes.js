import express from 'express';
import { allHomes } from '../controllers/homes_categoryController.js';



const router = express.Router();

// GET /all-homes
router.get('/all-homes', allHomes)




export default router;