import express from 'express';
import { allVehicles } from '../controllers/vehicles_categoryController.js';



const router = express.Router();

// GET /all-homes
router.get('/all-vehicles', allVehicles )




export default router;