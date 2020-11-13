// Comment out when not in production!
import dotenv from "dotenv";
dotenv.config();

const config = {
    env: process.env.NODE_ENV || "development",
    port: process.env.PORT || 3000,
    jwtSecret: process.env.REACT_APP_JWT_SECRET || "MyAppSecret",
    mongoUri: process.env.REACT_APP_MONGODB_URI || process.env.MONGO_HOST ||
        'mongodb://' + (process.env.IP || "localhost") + ':' +
        (process.env.MONGO_PORT || '27017') + '/sonbook_test'
}

export default config;