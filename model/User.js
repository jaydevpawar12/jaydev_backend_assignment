const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
name:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
mobile:{
    type:String,
    required:true
},
password:{
    type:String,
    required:true
},
otp:{
    type:String,
},
otpExpire:{
    type:Date,
},
role:{
    type:String,
    default:"user",
    enum:["admin","user"]

}
},{timestamps:true})

module.exports=mongoose.model("user",userSchema)