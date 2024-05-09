//backend/controllers/userController.js

const User = require('../models/users');

// Create a new user profile
exports.createUserProfile = async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({ message: 'User profile created successfully', userProfile: newUser });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a specific user profile
exports.getUserProfile = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ userProfile: user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a specific user profile
exports.updateUserProfile = async (req, res) => {
    const { userId } = req.params;
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
        res.json({ message: 'Profile updated successfully', userProfile: updatedUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a specific user profile, can be made by the user or by the admin
exports.deleteUserProfile = async (req, res) => {
    const { userId } = req.params; // ID of the user to delete
    const requestingUser = req.user; // User data decoded from the JWT

    try {
        const userToDelete = await User.findById(userId);

        if (!userToDelete) {
            return res.status(404).send('User not found');
        }

        // Check if the requesting user is the owner of the account or an admin
        if (requestingUser.id !== userId && requestingUser.role !== 'admin') {
            return res.status(403).send('Access denied. Cannot delete other user profiles.');
        }

        await User.findByIdAndDelete(userId);
        res.send('User profile deleted successfully');
    } catch (error) {
        res.status(500).send('Error deleting user profile');
    }
};


exports.suspendUser = async (req, res) => {
    const { userId, period } = req.body;  // Period in days
    try {
        const suspensionEnd = new Date();
        suspensionEnd.setDate(suspensionEnd.getDate() + period);
        await User.findByIdAndUpdate(userId, { suspended: true, suspensionEnd });
        res.send(`User suspended for ${period} days`);
    } catch (error) {
        res.status(500).send('Error suspending user');
    }
};

  
  exports.deleteUser = async (req, res) => {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.send('User deleted');
  };

  exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const onlineUsers = await User.countDocuments({ online: true });  // Assuming there's a field to track online status
        res.json({ totalUsers, onlineUsers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


  exports.getfollowers = async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId).populate('followers', 'username ');
      res.status(200).json({ followers: user.followers }); // Corrected typo here
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Could not fetch the users' }); // Corrected message here
    }
  };
  
  exports.followUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const { followerId } = req.body; // Use req.body to get followerId
  
      const userActive = await User.findById(userId);
      if (!userActive) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if the followerId is already in the followers array
      if (!userActive.followers.includes(followerId)) {
        userActive.followers.push(followerId);
        await userActive.save();
      }
  
      res.status(200).json({ message: 'Followed' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Could not follow the user' });
    }
  };
  

  exports.unfollowUser = async (req, res) => {
    try {
        const {userId} = req.params;
        const {followerId} = req.body;
        const useractive = await User.findById(userId);
      if (!useractive) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Remove the follower if already following
      const Index = useractive.followers.indexOf(followerId);
      if (Index !== -1) {
        useractive.followers.splice(Index, 1);
        await useractive.save();
      }
  
      res.status(200).json({ message: 'User unfollowed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  