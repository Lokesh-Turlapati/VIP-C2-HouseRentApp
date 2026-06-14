const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getPendingOwners,
  approveOwner,
  rejectOwner,
  deleteUser,
  getAllProperties,
  deleteProperty,
  getAllBookings
} = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');


router.use(protect, authorizeRoles('admin'));


router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);


router.get('/owners/pending', getPendingOwners);
router.put('/owners/:id/approve', approveOwner);
router.put('/owners/:id/reject', rejectOwner);


router.get('/properties', getAllProperties);
router.delete('/properties/:id', deleteProperty);

// Booking oversight
router.get('/bookings', getAllBookings);

module.exports = router;