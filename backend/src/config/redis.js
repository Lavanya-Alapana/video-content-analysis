export const getRedisConfig = () => {
  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

  return {
    host: redisUrl.includes("://") ? new URL(redisUrl).hostname : "localhost",
    port: 6379,
  };
};
