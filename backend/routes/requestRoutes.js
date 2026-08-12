const express = require('express');
const router = express.Router();
const {
    createBloodRequest, getAllRequests, getMyRequests, getMyEmergencyRequests, getMyDirectRequests, getIncomingDirectRequests,
    getIncomingEmergencyRequests,
    respondToRequest, cancelRequest, updateRequest, deleteRequest
} = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

router.get('/all', protect, getAllRequests);
router.get('/mine', protect, getMyRequests);
router.get('/mine/emergency', protect, getMyEmergencyRequests);
router.get('/mine/direct', protect, getMyDirectRequests);
router.get('/incoming', protect, getIncomingDirectRequests);
router.get('/incoming/emergency', protect, getIncomingEmergencyRequests);
router.post('/create', protect, createBloodRequest);
router.patch('/:id/respond', protect, respondToRequest);
router.patch('/:id/cancel', protect, cancelRequest);
router.put('/:id', protect, updateRequest);
router.delete('/:id', protect, deleteRequest);

module.exports = router;
