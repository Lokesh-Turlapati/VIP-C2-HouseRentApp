const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/connect');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // serve uploaded property images

// Routes
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/owner', require('./routes/ownerRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health check
app.get('/', (req, res) => {
  res.send('House Rent Management API is running...');
});

// Connect DB then start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});