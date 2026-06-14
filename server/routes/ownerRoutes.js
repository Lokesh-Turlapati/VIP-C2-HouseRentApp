const express = require('express');
const router = express.Router();
const {
  createProperty,
  getMyProperties,
  updateProperty,
  deleteProperty,
  toggleAvailability,
  getBookingRequests,
  updateBookingStatus
} = require('../controllers/ownerController');
const { protect, authorizeRoles, requireApproved } = require('../middlewares/authMiddleware');


router.use(protect, authorizeRoles('owner'), requireApproved);

router.post('/properties', createProperty);
router.get('/properties', getMyProperties);
router.put('/properties/:id', updateProperty);
router.delete('/properties/:id', deleteProperty);
router.put('/properties/:id/availability', toggleAvailability);

router.get('/bookings', getBookingRequests);
router.put('/bookings/:id/status', updateBookingStatus);

module.exports = router;