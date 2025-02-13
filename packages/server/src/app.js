import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import categories from './routes/categoriesRoutes.js';
import hotels from './routes/hotles_categoryRoutes.js';
import vehicles from './routes/vehicles_categoryRoutes.js';
import cors from "cors"

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', categories);
app.use('/api', hotels);
app.use('/api', vehicles);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));