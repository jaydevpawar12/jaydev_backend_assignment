const { nanoid } = require("nanoid")
const User = require("../model/User")
const { checkEmpty } = require("../utils/handleEmpty")
const bcrypt=require("bcryptjs")
const validator = require("validator")
const jwt=require("jsonwebtoken")
const asyncHandler=require("express-async-handler")
const sendEmail = require("../utils/email")

// Admin Registration
exports.registerAdmin=asyncHandler(async(req,res)=>{
const {name,email,mobile,password,role}=req.body
const {isError,error}=checkEmpty({name,email,mobile,password,role})
if(isError){
    return res.status(400).json({
        status:400,
        message:"All Fields are required",
        error
    })
}
// validate the email
if (!validator.isEmail(email)) {
    return res.status(400).json({
        status:400,
         message:"Email is Invalid", 
         error: "Invalid Email" 
        })
}
// password at least 8 character including one capital lettar,symbol,number 
if (!validator.isStrongPassword(password)) {
    return res.status(400).json({status:400, message:"Password Is Invalid",  error: "Provide Strong Password 1 Capital Special Chars and min. 8 Chars " })
}

const result=await User.findOne({ $or: [{ email }, { mobile }],})
if(result){
return res.status(400).json({ 
    status:400,
    message:"Admin Already Exists",
    })
}
// password hashing 
const hash=await bcrypt.hash(password,10)
await User.create({...req.body,password:hash})
res.status(200).json({
    status:200,
    message:"Admin register Successfully",
})
})

// User Registration
exports.registerUser=asyncHandler(async(req,res)=>{
const {name,email,mobile,password}=req.body

const {isError,error}=checkEmpty({name,email,mobile,password})
if(isError){
    return res.status(400).json({
        status:400,
        message:"All Fields are required",
        error
    })
}
// validate the email

if (!validator.isEmail(email)) {
    return res.status(400).json({status:400, message:"Email is Invalid", error: "Invalid Email" })
}
// password at least 8 character including one capital lettar,symbol,number 

if (!validator.isStrongPassword(password)) {
    return res.status(400).json({status:400, message:"Password Is Invalid",  error: "Provide Strong Password 1 Capital Special Chars and min. 8 Chars " })
}

const result=await User.findOne({ 
    $or: [{ email }, { mobile }],})
if(result){
return res.status(400).json({ 
    status:400,
    message:"User Already Exists",
    })
}
// password hashing 
const hash=await bcrypt.hash(password,10)
await User.create({...req.body,password:hash})
res.status(200).json({
    status:200,
    message:"User register Successfully",
})
})

// Login User AND Admin
exports.loginUser=asyncHandler(async(req,res)=>{
    // Login with Email Or Mobile
    const { username, password } = req.body
    const result = await User.findOne({
        $or: [
            { mobile: username },
            { email: username }
        ]
    })
    if (!result) {
        return res.status(400).json({status:400,  message: "User not found" })
    }
//  compare password
    const verify = await bcrypt.compare(password, result.password)
    if (!verify) {
        return res.status(400).json({status:400,   message: "Invalid password" })
    }
    // create token and set cookie as per the role
    const token = jwt.sign({ userId: result._id }, process.env.JWT_KEY, { expiresIn: "1d" })

    if (result.role==="user") {
        
        res.cookie("auth", token, { maxAge: 1000 * 60 * 60, httpOnly: true })
    }else{
        res.cookie("admin", token, { maxAge: 1000 * 60 * 60, httpOnly: true })

    }
    res.status(200).json({
        status:200,
        message: "User login successfully", result: {
            userId: result._id,
            mobile: result.mobile,
            name: result.name,
            email: result.email,
            token:token
           
        }
    })
})

// Forgot Password
exports.forgotPasswordOtp=asyncHandler(async(req,res)=>{
    const {email}=req.body
    const result =await User.findOne({email})
    if(!result){
        return res.status(400).json({status:400,message :"User not found"})
    }
    // create OTP with nanoid
const OTP=nanoid(4)
await User.findByIdAndUpdate(result._id,
    { otp:OTP,otpExpire:new Date(Date.now() + (5*60*1000)) })
// send mail on given email with otp
    await sendEmail({
        to:process.env.FROM_EMAIL,
        subject:"Login Otp",
        message:   `Do Not Share The Otp With anyone:${OTP}`

    })
    res.status(200).json({status:200,message:"Otp send success"})
})

exports.resetPassword=asyncHandler(async(req,res)=>{
    const {otp,newPassword,email}=req.body
    const result =await User.findOne({email})
    if(!result){
        return res.status(400).json({status:400,message :"User not found"})
    }
    // Check Otp Expiration 
    if(result.otpExpire < new Date(Date.now())){
        await User.findByIdAndUpdate(result._id,{otp:""})
        return res.status(400).json({status:400,message:"Your OTP Is Expired."})
    }
    // verify the OTP
    if(result.otp!==otp){
        return res.status(400).json({status:400,message:"Your OTP Not Matched."})
    }
    // Hashing the newpassword
    const hash =await  bcrypt.hash(newPassword,10)
    await User.findByIdAndUpdate(result._id,{password:hash})
    res.status(200).json({ status:200,message:"PassWord Reset Success Please Re-Login"})
  
})

//Logout user and admin  asd
exports.logoutUser = asyncHandler(async (req, res) => {
  
    res.clearCookie("auth")
 
    res.status(200).json({status:200, message: " logout successfully" })
})

exports.logoutAdmin = asyncHandler(async (req, res) => {
    res.clearCookie("admin")
    res.status(200).json({status:200, message: " logout successfully" })
})

