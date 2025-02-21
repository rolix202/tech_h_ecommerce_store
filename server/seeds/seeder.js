import pg from "pg";
const { Pool } = pg;

import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.DB_PORT
});

const createTables = async () => {

    let client;

    try {
        client = await pool.connect();

        console.log("Creating tables...");

        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                phoneNo VARCHAR(15) NOT NULL,
                password TEXT NOT NULL CHECK (LENGTH(password) >= 8),
                role VARCHAR(20) CHECK (role IN ('customer', 'admin')) DEFAULT 'customer',
                gender VARCHAR(20) CHECK (gender IN ('male', 'female')) NOT NULL,
                state VARCHAR(100) NOT NULL,
                city VARCHAR(100) NOT NULL,
                address VARCHAR(255) NOT NULL,
                status VARCHAR(10) CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
                lastlogin TIMESTAMP DEFAULT NOW(),
                isverified BOOLEAN DEFAULT false,
                resetPasswordToken TEXT DEFAULT NULL,
                resetPasswordExpiresAt TIMESTAMP DEFAULT NULL,
                verificationToken TEXT DEFAULT NULL,
                verificationTokenExpiresAt TIMESTAMP DEFAULT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `);

        console.log("users table created successfully.");

        // update time function
        await client.query(`
            CREATE OR REPLACE FUNCTION update_timestamp()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        // trigger to update the time
        await client.query(`
            CREATE TRIGGER trigger_update_timestamp
            BEFORE UPDATE ON users
            FOR EACH ROW
            EXECUTE FUNCTION update_timestamp();
        `);

        console.log("Trigger for updating timestamps created successfully.");
    } catch (error) {
        console.error("Error setting up tables:", error);
    } finally {
        if (client) client.release();
    }
};

(async () => {
    await createTables();
    pool.end();
})();
