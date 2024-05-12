const User = require('../models/users')

// Create a new user profile
exports.createUserProfile = async (req, res) => {
  try {
    const newUser = new User(req.body)
    await newUser.save()
    res.status(201).json({
      message: 'User profile created successfully',
      userProfile: newUser,
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Get a specific user profile
exports.getUserProfile = async (req, res) => {
  const { userId } = req.params
  try {
    const user = await User.findById(userId)
      .populate({
        path: 'followers',
        model: 'User',
      })
      .populate({
        path: 'follows',
        model: 'User',
      })
      .populate({
        path: 'posts',
        model: 'Post',
      })

    if (!user) {
      return res.status(404).send('User not found')
    }

    res.json(user)
  } catch (error) {
    res.status(500).send(error.message)
  }
}

// Update a specific user profile
exports.updateUserProfile = async (req, res) => {
  const { userId } = req.params
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    })
    res.json({
      message: 'Profile updated successfully',
      userProfile: updatedUser,
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Delete a specific user profile, can be made by the user or by the admin
exports.deleteUserProfile = async (req, res) => {
  const { userId } = req.params // ID of the user to delete
  const requestingUser = req.user // User data decoded from the JWT

  try {
    const userToDelete = await User.findById(userId)

    if (!userToDelete) {
      return res.status(404).send('User not found')
    }

    // Check if the requesting user is the owner of the account or an admin
    if (requestingUser.id !== userId && requestingUser.role !== 'admin') {
      return res
        .status(403)
        .send('Access denied. Cannot delete other user profiles.')
    }

    await User.findByIdAndDelete(userId)
    res.send('User profile deleted successfully')
  } catch (error) {
    res.status(500).send('Error deleting user profile')
  }
}

exports.getUsersByUsername = async (req, res) => {
  try {
    const query = req.query.username
    if (!query) {
      return res
        .status(400)
        .json({ message: 'Username query parameter is required' })
    }

    const users = await User.find({
      username: { $regex: query, $options: 'i' },
    })

    if (!users.length) {
      return res.status(404).json({ message: 'No users found' })
    }

    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

exports.suspendUser = async (req, res) => {
  const { userId, period } = req.body // Period in days
  try {
    const suspensionEnd = new Date()
    suspensionEnd.setDate(suspensionEnd.getDate() + period)
    await User.findByIdAndUpdate(userId, { suspended: true, suspensionEnd })
    res.send(`User suspended for ${period} days`)
  } catch (error) {
    res.status(500).send('Error suspending user')
  }
}

exports.deleteUser = async (req, res) => {
  const { userId } = req.params
  await User.findByIdAndDelete(userId)
  res.send('User deleted')
}

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const onlineUsers = await User.countDocuments({ online: true }) // Assuming there's a field to track online status
    res.json({ totalUsers, onlineUsers })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
