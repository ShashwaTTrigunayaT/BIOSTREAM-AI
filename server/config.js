require('dotenv').config();

const config = {
  server: {
    port: process.env.PORT || 5000,
    corsOrigin: process.env.CORS_ORIGIN || "*", 
  },
  ai: {
    apiKey: process.env.GEMINI_API_KEY,
    modelName: "gemini-2.0-flash-lite-001",
    promptLimit: 20,
  },
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    enabled: false // Set to true only if you have Redis installed and running
  },
  simulation: {
    intervalMs: 100, // Speed of the heartbeat stream
    csvPath: './data.csv'
  }
};

module.exports = config;

