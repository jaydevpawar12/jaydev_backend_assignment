const mongoose=require("mongoose")
const express=require("express")
const helmet=require("helmet")
const morgan=require("morgan")
const mongoSanitize=require("express-mongo-sanitize")
const compression=require("compression")
const cors=require("cors")
const cookieParser=require("cookie-parser")
require("dotenv").config()

const authRoute=require("./routes/authRoutes")
const adminRoute=require("./routes/adminRoutes")
const { adminProtected } = require("./middleware/protected")
const { redis } = require("./config/redis")

const app=express()
app.use(express.json())
app.use(cookieParser())

redis.on('connect', () => {
    console.log("Connected to Redis!");
})

app.use(cors({
    origin:true,
    credentials:true
}))

app.use(helmet())
app.use(compression())
app.use(morgan(`tiny`))
app.use(mongoSanitize());

app.use("/api/auth",authRoute)
app.use("/api/admin",adminProtected,adminRoute)



app.use("*", (req, res) => {
    res.status(404).json({status:404, message: "Resource NOT Found" })
})

app.use((err,req,res,next)=>{
    console.log(err)
    res.status(500).json({status:500,error:err.message || "Something went Wrong"})
})

mongoose.connect(process.env.MONGO_URL)
mongoose.connection.once("open",()=>{
    console.log("Connected TO MongoDB")
    app.listen(process.env.PORT,console.log("SERVER RUNNING 🏃‍♂️"))
})