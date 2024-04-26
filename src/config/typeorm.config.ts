import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export function initTypeOrm(): TypeOrmModuleOptions {
    const { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USERNAME } = process.env;
    console.log( DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USERNAME);
    
    return {
        type: "postgres",
        host: DB_HOST,
        port: DB_PORT,
        username: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_DATABASE,
        entities: [
            "dist/**/**/**/*.entity{.ts,.js}",
            "dist/**/**/*.entity{.ts,.js}",
        ],
        synchronize: true,
    }
}