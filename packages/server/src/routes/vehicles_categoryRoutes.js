import express from 'express';
import { addVehicle, allVehicles, deleteVehicle, updateVehicle } from '../controllers/vehicles_categoryController.js';



const router = express.Router();

router.get('/all-vehicles', allVehicles);
router.post('/vehicles/insert-vehicle', addVehicle);
router.put('/vehicles/update-vehicle/:id', updateVehicle);
router.delete('/vehicles/delete-vehicle/:id', deleteVehicle);




export default router;