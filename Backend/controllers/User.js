const bcrypt = require("bcrypt");
const User = require('../models/userSchema');
const Investor = require('../models/investorSchema');
const StartupOwner = require('../models/startupSchema');

exports.addUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, role, info, ...startupDetails } = req.body;

        if (!name || !email || !password || !confirmPassword || !role) {
            return res.status(400).json({
                success: false,
                message: "Fill all required details"
            });
        }
        
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let user;
        if (role === 'investor') {
            user = await Investor.create({ name, email, password: hashedPassword, role, info });
        } else if (role === 'startup') {
            user = await StartupOwner.create({ name, email, password: hashedPassword, role, ...startupDetails });
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid role"
            });
        }

        return res.status(201).json({
            success: true,
            message: "User added successfully",
            user
        });
    } catch (error) {
        console.error("Error adding user:", error);
        return res.status(500).json({
            success: false,
            message: "Some error occurred while adding user"
        });
    }
};


exports.getSingleUser = async (req, res) => {
    try {
        const { id } = req.user;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        let userProfile;
        if (user.role === 'investor') {
            userProfile = await Investor.findById(id);
        } else if (user.role === 'startup') {
            userProfile = await StartupOwner.findById(id);
        }

        if (!userProfile) {
            return res.status(404).json({
                success: false,
                message: "User profile not found"
            });
        }

        userProfile.password = undefined;

        return res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            user: userProfile
        });
    } catch (error) {
        console.error("Error retrieving user:", error);
        return res.status(500).json({
            success: false,
            message: "Some error occurred while retrieving user"
        });
    }
};


exports.deleteProfile = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the user
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Delete corresponding profile based on role
        let deletedProfile;
        if (user.role === 'investor') {
            deletedProfile = await Investor.findByIdAndDelete(id);
        } else if (user.role === 'startup') {
            deletedProfile = await StartupOwner.findByIdAndDelete(id);
        }

        return res.status(200).json({
            success: true,
            message: "User and profile deleted successfully",
            user,
            profile: deletedProfile
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({
            success: false,
            message: "Some error occurred while deleting user"
        });
    }
};
