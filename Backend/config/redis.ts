// Contoh di dalam config/redis.ts
import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379", // diatur di file .env kamu
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

export const connectRedis = async () => {
  await redisClient.connect();
  console.log("Redis connected successfully!");
};

export default redisClient;
