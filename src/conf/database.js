import dotenv from 'dotenv';

dotenv.config();

export const dbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10),
    connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT, 10),
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT, 10),
    max: parseInt(process.env.DB_MAX_CONNECTIONS, 10)
};