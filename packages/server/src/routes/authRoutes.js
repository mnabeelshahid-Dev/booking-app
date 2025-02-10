import express from 'express';
import {
    register,
    login,
    logout,
    getProfile,
    forgotPassword,
    resetPassword,
    sendLoginOtp,
    resendLoginOtp
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/get-profile', getProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/login-otp', sendLoginOtp);
router.post('/resend-otp', resendLoginOtp);

export default router;