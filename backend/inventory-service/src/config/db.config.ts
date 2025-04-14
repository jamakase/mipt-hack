import { DataSourceOptions } from "typeorm";

export default (): DataSourceOptions => ({
    type: 'postgres',
    dropSchema: false,
    synchronize: true,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    schema: process.env.DB_SCHEMA,
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    migrations: [__dirname + '/../db/migrations/**/*{.ts,.js}'],
});