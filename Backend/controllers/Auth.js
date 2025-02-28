const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const otpGenerator = require("otp-generator");
const OTP = require("../models/OTP");

const Investor = require("../models/investorSchema");
const StartupOwner = require("../models/startupSchema");

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        let user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User is not registered"
            });
        }

        const payload = {
            email: user.email,
            id: user._id,
            role: user.role
        };

        if (await bcrypt.compare(password, user.password)) {
            // Password Match
            let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });

            user = user.toObject();
            user.token = token;
            user.password = undefined;

            // Fetch additional details based on role
            let profile = null;
            if (user.role === "investor") {
                profile = await Investor.findById(user._id);
            } else if (user.role === "startup") {
                profile = await StartupOwner.findById(user._id);
            }

            // Create cookie
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
                httpOnly: true,
                sameSite: "strict"
            };

            res.cookie("hackOpsCookie", token, options).status(200).json({
                success: true,
                token,
                user,
                profile, // Include role-specific details
                message: "User logged in successfully",
            });

        } else {
            // Password does not match
            return res.status(403).json({
                success: false,
                message: "Password Incorrect"
            });
        }
    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({
            success: false,
            message: "Some error occurred while logging in"
        });
    }
};


exports.logout = (req, res) => {
    try {
        res.clearCookie('hackOpsCookie', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production' 
        });

        return res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });
    } catch (error) {
        console.error("Error logging out:", error);
        return res.status(500).json({
            success: false,
            message: "Some error occurred while logging out"
        });
    }
};


exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists",
            });
        }

        // Generate OTP
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        // Hash OTP
        const hashedOTP = await bcrypt.hash(otp, 10);

        // Store OTP in the database
        await OTP.create({ email, otp: hashedOTP });

        // // Send OTP via email
        // await mailSender(email, "Verification Email", emailTemplate(otp));

        return res.status(202).json({
            success: true,
            message: "OTP sent successfully",
            otp, // Remove this in production
        });
    } catch (error) {
        console.error("Error sending OTP:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required",
            });
        }

        const recentOtp = await OTP.find({ email }).sort("-createdAt").limit(1);

        if (!recentOtp.length) {
            return res.status(400).json({
                success: false,
                message: "OTP not found",
            });
        }

        const hashedOTP = recentOtp[0].otp;
        const isOtpValid = await bcrypt.compare(otp, hashedOTP);

        if (!isOtpValid) {
            return res.status(403).json({
                success: false,
                message: "Incorrect OTP",
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { email, isOtpVerified: true },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Set a secure cookie
        res.cookie("otpCookie", token, {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
            httpOnly: true,
            sameSite: "strict",
        });

        return res.status(200).json({
            success: true,
            token,
            message: "OTP verified successfully",
        });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { email, oldPassword, newPassword, confirmNewPassword } = req.body;

        if (!email || !oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "New password and confirmation do not match",
            });
        }

        if (newPassword === oldPassword) {
            return res.status(400).json({
                success: false,
                message: "New password cannot be the same as the old password",
            });
        }

        const user = await User.findById(userId);
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Incorrect old password",
            });
        }

        // Hash new password and update user
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        // // Notify user via email
        // await mailSender(
        //     email,
        //     "Password Changed",
        //     `<p>Dear ${user.firstName} ${user.lastName}, Your password has been changed successfully.</p>`
        // );

        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (error) {
        console.error("Error changing password:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred",
        });
    }
};

exports.contactUs = async (req, res) => {
    try {
        const { firstName, lastName, email, message } = req.body;

        if (!firstName || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided",
            });
        }

        const fullName = lastName ? `${firstName} ${lastName}` : firstName;

        // Send acknowledgment email to the user
        // await mailSender(email, "Thank You for Contacting Us", contactUsEmail(email, fullName, message));

        // Notify admin/owner
        // await mailSender(process.env.OWNER_MAILS, "New Contact Submission", contactUsOwnerEmail(fullName, email, message));

        return res.status(200).json({
            success: true,
            message: "Form submitted successfully",
        });
    } catch (error) {
        console.error("Error in contactUs function:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

