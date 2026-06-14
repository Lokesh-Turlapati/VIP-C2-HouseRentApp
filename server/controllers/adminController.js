const User = require('../models/UserSchema');
const Property = require('../models/PropertySchema');
const Booking = require('../models/BookingSchema');


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getPendingOwners = async (req, res) => {
  try {
    const pendingOwners = await User.find({ role: 'owner', isApproved: false }).select('-password');
    res.json(pendingOwners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveOwner = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role !== 'owner') {
      return res.status(400).json({ message: 'User is not registered as an owner' });
    }

    user.isApproved = true;
    await user.save();

    res.json({ message: `Owner ${user.name} approved successfully`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.rejectOwner = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isApproved = false;
    await user.save();

    res.json({ message: `Owner ${user.name} rejected/revoked`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate('owner', 'name email');
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    await property.deleteOne();
    res.json({ message: 'Property deleted by admin' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('property', 'title address')
      .populate('tenant', 'name email')
      .populate('owner', 'name email');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};