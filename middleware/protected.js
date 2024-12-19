const jwt = require("jsonwebtoken")
const User = require("../model/User")


exports.adminProtected = (req, res, next) => {
    const admin = req.cookies.admin
    if (!admin) {
        return res.status(401).json({ message: "No cookie found" })
    }
    jwt.verify(admin, process.env.JWT_KEY,async (err, decode) => {
        if (err) {
            return res.status(500).json({ message: err.message || "Invalid Token" })
        }
        const result = await User.findById(decode.userId)
        if (result.role !== "admin") {
            return res.status(401).json({ error: "Admin Only Route" })
        }
        req.user = decode.userId
        next()
    })

}