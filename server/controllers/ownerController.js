const Property = require('../models/PropertySchema');
const Booking = require('../models/BookingSchema');


exports.createProperty = async (req, res) => {
  try {
    const property = new Property({
      ...req.body,
      owner: req.user.id
    });
    await property.save();
    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user.id });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (property.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this property' });
    }

    Object.assign(property, req.body);
    await property.save();
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (property.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }

    await property.deleteOne();
    res.json({ message: 'Property deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.toggleAvailability = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (property.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    property.available = !property.available;
    await property.save();
    res.json({ message: `Property marked as ${property.available ? 'available' : 'unavailable'}`, property });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getBookingRequests = async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user.id })
      .populate('property', 'title address rentAmount')
      .populate('tenant', 'name email');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved or rejected' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = status;
    await booking.save();

 
    if (status === 'approved') {
      await Property.findByIdAndUpdate(booking.property, { available: false });
    }

    res.json({ message: `Booking ${status}`, booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};