import express from 'express';
import { allHotels, createHotel, deleteHotel, getHotelDetail, updateHotel } from '../controllers/hotles_categoryController.js';



const router = express.Router();

// GET /all-hotels
router.get('/all-hotels', allHotels);
router.post('/hotels/insert-hotel', createHotel);
router.get('/hotels/hotel-details/:id', getHotelDetail);
router.put('/hotels/update-hotel/:id', updateHotel);
router.delete('/hotels/delete-hotel/:id', deleteHotel);




export default router;