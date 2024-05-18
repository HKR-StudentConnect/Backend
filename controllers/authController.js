const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/users')

exports.register = async (req, res) => {
  const { password } = req.body
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({
      ...req.body,
      hashedPassword,
    })
    await newUser.save()
    res.status(201).json({ message: 'User registered successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).send('User not found')
    }

    const isMatch = await bcrypt.compare(password, user.hashedPassword)
    if (!isMatch) {
      return res.status(400).send('Invalid credentials')
    }

    const token = jwt.sign(
      { userID: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )
    res.json({ userId: user._id, token: token })
  } catch (error) {
    console.error('Login error for user:', email, error)
    res.status(500).send(error.message)
  }
}



// Admin login function - recently added function
// backend/controllers/authController.js

// Admin login function
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log('Admin login attempt:', email); // Debugging log

    const user = await User.findOne({ email, role: 'admin' });
    if (!user) {
      console.log('Admin not found or not an admin'); // Debugging log
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) {
      console.log('Password mismatch'); // Debugging log
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error('Server error:', error); // Debugging log
    res.status(500).json({ message: 'Server error' });
  }
};