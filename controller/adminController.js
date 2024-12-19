const { redis} = require("../config/redis")
const User = require("../model/User")
const asyncHandler = require("express-async-handler")



exports.getAllUser=asyncHandler(async(req,res)=>{   
    try {
        const user="user"
        const exist=await redis.exists(user)
        let value
        if (exist) {
            value=await redis.get(user)
            await redis.expire(user,50)
            console.log("From redis")
            return res.json({message:"Fetch Success",result:JSON.parse(value)})
        }else{
            const result=await User.find()
            await redis.set(user,JSON.stringify(result))
            await redis.expire(user,50)
            value= await redis.get(user)
            console.log("From Database")
           return res.json({message:"Fetch Success",result:JSON.parse(value)})
        }
        // const parseData=JSON.parse(value)
    } catch (error) {
        console.log(error)
        console.error("fetching error")
    }
})