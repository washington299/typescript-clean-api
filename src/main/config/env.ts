export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-api-node',
  port: process.env.port || 3003,
};
