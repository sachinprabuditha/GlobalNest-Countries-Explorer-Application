// routes/user.js

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Middleware to verify authentication
const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

// Get user's favorite countries
router.get('/favorites', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ favoriteCountries: user.favoriteCountries });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add a country to favorites
router.post('/favorites', authenticate, async (req, res) => {
  try {
    const { countryCode } = req.body;
    
    if (!countryCode) {
      return res.status(400).json({ message: 'Country code is required' });
    }
    
    const user = await User.findById(req.user._id);
    
    // Check if country already in favorites
    if (user.favoriteCountries.includes(countryCode)) {
      return res.status(400).json({ message: 'Country already in favorites' });
    }
    
    // Add to favorites
    user.favoriteCountries.push(countryCode);
    await user.save();
    
    res.status(200).json({ 
      message: 'Country added to favorites', 
      favoriteCountries: user.favoriteCountries 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove a country from favorites
router.delete('/favorites/:countryCode', authenticate, async (req, res) => {
  try {
    const { countryCode } = req.params;
    
    const user = await User.findById(req.user._id);
    
    // Check if country in favorites
    if (!user.favoriteCountries.includes(countryCode)) {
      return res.status(400).json({ message: 'Country not in favorites' });
    }
    
    // Remove from favorites
    user.favoriteCountries = user.favoriteCountries.filter(
      code => code !== countryCode
    );
    await user.save();
    
    res.status(200).json({ 
      message: 'Country removed from favorites', 
      favoriteCountries: user.favoriteCountries 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;