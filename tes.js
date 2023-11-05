require("dotenv").config()

const { createClient } = require("redis")

const { REDIS_PASSWORD } = process.env

const redisClient = createClient({
  password: REDIS_PASSWORD,
  socket: {
    host: "redis-12610.c295.ap-southeast-1-1.ec2.cloud.redislabs.com",
    port: 12610,
  },
})

redisClient.connect()

redisClient.on("connect", async () => {
  console.log("Connected to our redis instance!")

  const data = await redisClient.set("testing", "halo ini wahyu")

  console.log(data)
})
