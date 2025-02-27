const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/User");


//auth middleware
exports.auth = async (req, res, next) => {
    try {
        const token = req.body.token || req.cookies.hackMateCookie || req.header("Authorization")?.replace("Bearer ", "");
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
            req.user = decode;
            console.log(req.user)
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


const checkRole = (expectedRole) => {
    return (req, res, next) => {
        if (req.user.role !== expectedRole) {
            return res.status(401).json({
                success: false,
                message: `This is a protected route for ${expectedRole} only`
            })
        }
        next();
    };
};

// isOrganiser middleware
exports.isInvestor = checkRole("Investor");

// isParticipant middleware
exports.isStartup = checkRole("Startup");

// isAdmin middleware
exports.isAdmin = checkRole("Admin");
