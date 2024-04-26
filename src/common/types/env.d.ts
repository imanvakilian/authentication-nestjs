namespace NodeJS {
    interface ProcessEnv {
        // application
        PORT: number;
        // database
        DB_HOST: string;
        DB_USERNAME: string;
        DB_PASSWORD: string;
        DB_DATABASE: string;
        DB_PORT: number;
        // secrets
        COOKIE_PARSER_SECRET: string;
        JWT_REGISTER_SECRET: string;
        JWT_ACCESSTOKEN_SECRET: string;
        REGISTER_COOKIE_NAME: string;
        // GOOGLE
        GOOGLE_CLIENT_ID: String;
        GOOGLE_CLIENT_SECRET: String;
        // email
        EMAIL_HOST: String;
        EMAIL_USERNAME: String;
        EMAIL_PASSWORD: String;
        EMAIL_PORT: number;
        MY_EMAIL: String;
        // mobile
        KAVENEGAR_URL_API: String;
    }
}