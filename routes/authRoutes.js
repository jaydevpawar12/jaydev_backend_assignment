const router=require("express").Router()
const authController=require("../controller/authController")
const loginLimiter=require("../utils/limit")

router
.post("/register",authController.registerUser)
.post("/register-admin",authController.registerAdmin)
.post("/login",loginLimiter,authController.loginUser)
.post("/logout",authController.logoutUser)
.post("/forgotPass",authController.forgotPasswordOtp)
.post("/resetPass",authController.resetPassword)

module.exports = router