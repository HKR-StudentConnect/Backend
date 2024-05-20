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
    res.status(500).json({ message: error.message })
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (user.suspended) {
      return res.status(403).json({ message: 'Your account is suspended' })
    }

    const isMatch = await bcrypt.compare(password, user.hashedPassword)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { userID: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )
    res.status(200).json({ userId: user._id, token: token })
  } catch (error) {
    console.error('Login error for user:', email, error)
    res.status(500).send({ message: error.message })
  }
}
