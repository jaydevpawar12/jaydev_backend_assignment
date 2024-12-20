const router=require("express").Router()
const authController=require("../controller/authController")
const loginLimiter=require("../utils/limit")

router
.post("/register",authController.registerUser)
.post("/register-admin",authController.registerAdmin)
// apply rate limiter
.post("/login",loginLimiter,authController.loginUser)
.post("/logout",authController.logoutUser)
.post("/logout-admin",authController.logoutAdmin)
.post("/forgotPass",authController.forgotPasswordOtp)
.post("/resetPass",authController.resetPassword)

module.exports = router