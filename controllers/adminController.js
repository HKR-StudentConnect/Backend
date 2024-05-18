//recently added file
// backend/controllers/adminController.js
const User = require('../models/users');

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin || !(await admin.isPasswordCorrect(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = admin.generateAuthToken();
    res.json({ token, role: 'admin' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Other admin controller methods...
