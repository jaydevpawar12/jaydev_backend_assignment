const { default: Redis } = require("ioredis")
require("dotenv").config()
// implement the redis for cashing 
const redis = new Redis(process.env.REDIS_URL)
redis.on('error', (err) => {
    console.error("Redis connection error:", err);
})
module.exports = { redis }