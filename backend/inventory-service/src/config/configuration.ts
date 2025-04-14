import { DataSourceOptions } from "typeorm";
import dbConfig from "./db.config";

const bullMqConfig = () => ({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379, 
})

const workerConfig = () => ({
    url: process.env.WORKER_URL,
})

export default () => ({
    port: parseInt(process.env.PORT) || 3000,
    bullMq: bullMqConfig(),
    db: dbConfig(),
    worker: workerConfig()
})

export const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
