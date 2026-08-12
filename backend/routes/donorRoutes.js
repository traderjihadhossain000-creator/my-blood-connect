const express = require('express');
const router = express.Router();

const { searchDonors } = require('../controllers/donorController');
const { protect } = require('../middleware/authMiddleware');

router.get('/search', protect, searchDonors);

module.exports = router;
