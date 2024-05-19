const User = require('../models/users')
const Post = require('../models/posts')

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } })
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json(error.message)
  }
}

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
    res.status(500).json({ message: error.message })
  }
}

// Get a specific user profile
exports.getUserProfile = async (req, res) => {
  const { userId } = req.params
  try {
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).send('User not found')
    }
    res.json(user)
  } catch (error) {
    res.status(500).send(error.message)
  }
}

exports.getPublicUserById = async (req, res) => {
  const { userId } = req.params
  try {
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    return res.status(200).json({
      _id: user._id,
      username: user.username,
      profile: {
        name: user.profile.name,
        profilePictureUrl: user.profile.profilePictureUrl,
        university: user.profile.university,
        bio: user.profile.bio,
        profilePictureUrl: user.profile.profilePictureUrl,
      },
      follows: user.follows,
      followers: user.followers,
      posts: user.posts,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

// Update a specific user profile
exports.updateUserProfile = async (req, res) => {
  const { userId } = req.params
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    })
    res.status(200).json(updatedUser)
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

exports.getUserFollowsPosts = async (req, res) => {
  const { userId } = req.params
  try {
    const user = await User.findById(userId).populate('follows')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const followedUserIds = user.follows.map(followedUser => followedUser._id)
    const posts = await Post.find({ authorId: { $in: followedUserIds } }).sort({
      createdAt: -1,
    })
    res.status(200).json(posts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.suspendUser = async (req, res) => {
  const { userId } = req.body
  try {
    await User.findByIdAndUpdate(userId, { suspended: true })
    res.status(200).json({ message: 'User suspended successfully' })
  } catch (error) {
    res.status(500).send('Error suspending user')
  }
}

exports.unsuspendUser = async (req, res) => {
  const { userId } = req.body
  try {
    await User.findByIdAndUpdate(userId, { suspended: false })
    res.status(200).json({ message: 'User unsuspended successfully' })
  } catch (error) {
    res.status(500).send('Error unsuspending user')
  }
}

exports.deleteUser = async (req, res) => {
  const { userId } = req.params
  await User.findByIdAndDelete(userId)
  res.status(200).json({ message: 'User deleted successfully' })
}

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' })
    const onlineUsers = await User.countDocuments({ online: true })
    const suspendedUsers = await User.countDocuments({ suspended: true })
    const totalPosts = await Post.countDocuments()
    res.status(200).json({
      users: totalUsers,
      online_users: onlineUsers,
      suspendedUsers: suspendedUsers,
      posts: totalPosts,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
