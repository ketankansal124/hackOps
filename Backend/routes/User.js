const express = require("express");
const router = express.Router();

const { getSingleUser, deleteProfile, addUser } = require("../controllers/User");
const { login, sendOTP, verifyOtp, changePassword, contactUs, logout } = require("../controllers/Auth");
const { auth } = require("../middlewares/auth");
// const { resetPasswordToken, resetPassword } = require("../controllers/ResetPassword.js");

router.get("/", auth, getSingleUser);

router.post("/signup", addUser);
router.post("/login", login);
router.post("/logout", logout);
router.post("/changepassword", auth, changePassword);

router.post("/sendOtp", sendOTP);
router.post("/verifyOTP", verifyOtp);

router.post("/contactUs", contactUs);
router.delete("/:id", deleteProfile);


// router.post("/reset-password-token", resetPasswordToken);
// router.post("/reset-password", resetPassword);

module.exports = router;
