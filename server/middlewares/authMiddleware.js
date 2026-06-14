const jwt = require('jsonwebtoken');
const User = require('../models/UserSchema');


const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};


const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access denied: role '${req.user.role}' not permitted` });
    }
    next();
  };
};


const requireApproved = (req, res, next) => {
  if (req.user.role === 'owner' && !req.user.isApproved) {
    return res.status(403).json({ message: 'Your owner account is pending admin approval' });
  }
  next();
};

module.exports = { protect, authorizeRoles, requireApproved };