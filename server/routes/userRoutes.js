const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  browseProperties,
  getPropertyDetails,
  bookProperty,
  getMyBookings,
  cancelBooking
} = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/properties', protect, authorizeRoles('user'), browseProperties);
router.get('/properties/:id', protect, authorizeRoles('user'), getPropertyDetails);
router.post('/bookings', protect, authorizeRoles('user'), bookProperty);
router.get('/bookings', protect, authorizeRoles('user'), getMyBookings);
router.put('/bookings/:id/cancel', protect, authorizeRoles('user'), cancelBooking);

module.exports = router;