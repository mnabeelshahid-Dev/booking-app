import express from 'express';
import { allHotels, createHotel, getHotelDetail, updateHotel } from '../controllers/hotles_categoryController.js';



const router = express.Router();

// GET /all-homes
router.get('/all-hotels', allHotels);
router.post('create-hotel', createHotel);
router.get('hotel-details/:id', getHotelDetail);
router.put('update-hotel/:id', updateHotel);




export default router;