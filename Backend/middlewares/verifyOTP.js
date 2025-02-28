const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.isOtpVerified = async (req, res, next) => {
    try {
        const token = req.body.token || req.cookies.otpCookie || req.header("Authorization")?.replace("Bearer ", "");
        console.log(req.cookies)
        console.log(token)
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token Missing",
            });
        }
        //verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.otp = decode;
            console.log(req.otp)
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Token is Invalid"
            });
        }
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Something Went Wrong while verifying the token"
        })
    }
};