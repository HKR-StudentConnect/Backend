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
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(userId, { suspended: true });
    if (!user) return res.status(404).send('User not found');
    res.send('User suspended');
  };
  
  exports.deleteUser = async (req, res) => {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.send('User deleted');
  };
  