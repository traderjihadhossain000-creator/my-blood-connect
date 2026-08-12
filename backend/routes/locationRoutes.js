const express = require('express');
const { getLocationHierarchy } = require('../controllers/locationController');

const router = express.Router();
router.get('/hierarchy', getLocationHierarchy);

module.exports = router;
