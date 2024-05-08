//backend/controllers/authController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

exports.register = async (req, res) => {
  const { username, email, phoneNumber, password, role } = req.body; // role is included in the request
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      phoneNumber,
      hashedPassword,
      role  // Save the role as specified in the request
    });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Attempting login with', email, password); // Debugging output
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email); // Debugging output
      return res.status(404).send('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) {
      console.log('Password does not match for user:', email); // Debugging output
      return res.status(400).send('Invalid credentials');
    }

    const token = jwt.sign({ userID: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error for user:', email, error); // Debugging output
    res.status(500).send(error.message);
  }
};


