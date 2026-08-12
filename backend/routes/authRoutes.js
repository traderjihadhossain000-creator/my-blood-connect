const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, updateProfile, updateLocation, toggleAvailability, updateDonation } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/update-location', protect, updateLocation);
router.patch('/availability', protect, toggleAvailability);
router.patch('/donation', protect, updateDonation);

module.exports = router;
