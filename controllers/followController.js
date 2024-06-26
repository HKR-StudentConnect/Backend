const User = require('../models/users')
const Notification = require('../models/notifications')

exports.getUserFollowers = async (req, res) => {
  try {
    const { userId } = req.params
    const user = await User.findById(userId)
    res.status(200).json({ followers: user.followers })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Could not fetch followers' })
  }
}

exports.getUserFollows = async (req, res) => {
  try {
    const { userId } = req.params
    const user = await User.findById(userId)
    res.status(200).json({ follows: user.follows })
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch follows' })
  }
}

exports.followUser = async (req, res) => {
  try {
    const { userId } = req.params
    const { followeeId } = req.body

    const user = await User.findById(userId)
    const followee = await User.findById(followeeId)

    if (!user && !followee) {
      return res.status(404).json({ message: 'User not found' })
    }

    let followed = false

    if (!user.follows.includes(followeeId)) {
      user.follows.push(followeeId)
      await user.save()
      followed = true
    }

    if (!followee.followers.includes(userId)) {
      followee.followers.push(userId)
      await followee.save()
      followed = true
    }

    if (followed) {
      // Send follow notification
      const newNotification = new Notification({
        recipient: followeeId,
        sender: userId,
        type: 'follow',
      })

      await newNotification.save()
    }

    res.status(200).json(followee._id)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Could not follow the user' })
  }
}

exports.unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params
    const { followeeId } = req.query

    const user = await User.findById(userId)
    const followee = await User.findById(followeeId)

    if (!user || !followee) {
      return res.status(404).json({ message: 'User not found' })
    }

    const followeeIndex = user.follows.indexOf(followeeId)
    if (followeeIndex !== -1) {
      user.follows.splice(followeeIndex, 1)
      await user.save()
    }

    const userIndex = followee.followers.indexOf(userId)
    if (userIndex !== -1) {
      followee.followers.splice(userIndex, 1)
      await followee.save()
    }

    res.status(200).json(followeeId)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
