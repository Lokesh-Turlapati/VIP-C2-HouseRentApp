const User = require('../models/UserSchema');
const Property = require('../models/PropertySchema');
const Booking = require('../models/BookingSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};


exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const finalRole = role === 'owner' ? 'owner' : 'user';

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: finalRole,
      isApproved: finalRole === 'user'
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.browseProperties = async (req, res) => {
  try {
    const { city, minRent, maxRent, bedrooms } = req.query;
    const filter = { available: true };

    if (city) filter['address.city'] = city;
    if (bedrooms) filter.bedrooms = bedrooms;
    if (minRent || maxRent) {
      filter.rentAmount = {};
      if (minRent) filter.rentAmount.$gte = Number(minRent);
      if (maxRent) filter.rentAmount.$lte = Number(maxRent);
    }

    const properties = await Property.find(filter).populate('owner', 'name email');
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getPropertyDetails = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'name email');
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.bookProperty = async (req, res) => {
  try {
    const { propertyId, contactNumber, message, moveInDate } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (!property.available) {
      return res.status(400).json({ message: 'Property is not available for booking' });
    }

    const booking = await Booking.create({
      property: property._id,
      tenant: req.user.id,
      owner: property.owner,
      contactNumber,
      message,
      moveInDate,
      monthlyRent: property.rentAmount
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ tenant: req.user.id })
      .populate('property', 'title address rentAmount')
      .populate('owner', 'name email');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.tenant.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: `Cannot cancel a booking that is already ${booking.status}` });
    }

    booking.status = 'cancelled';
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};