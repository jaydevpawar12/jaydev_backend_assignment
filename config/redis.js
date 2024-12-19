const { default: Redis } = require("ioredis")
require("dotenv").config()

const redis = new Redis(process.env.REDIS_URL)
redis.on('error', (err) => {
    console.error("Redis connection error:", err);
})
module.exports = { redis }