const jwt = require("jsonwebtoken")
const User = require("../model/User")


exports.adminProtected = (req, res, next) => {
    const admin = req.cookies.admin
    if (!admin) {
        return res.status(401).json({status:401, message: "No cookie found" })
    }
    jwt.verify(admin, process.env.JWT_KEY,async (err, decode) => {
        if (err) {
            return res.status(500).json({status:500, message: err.message || "Invalid Token" })
        }
        const result = await User.findById(decode.userId)
        if (result.role !== "admin") {
            return res.status(401).json({status:401, error: "Admin Only Route" })
        }
        req.user = decode.userId
        next()
    })

}