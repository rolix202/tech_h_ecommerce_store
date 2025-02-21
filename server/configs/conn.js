import pg from "pg";
import dotenv from "dotenv";

const { Pool } = pg;
dotenv.config();

export const pool = new Pool({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.DB_PORT,
    max: process.env.MAX,
    idleTimeoutMillis: process.env.IDLE_TIMEOUT

})

pool.on("connect", () => {
    console.log("Database connected successfully");
})

pool.on("error", (err) => {
    console.error("Unexpected error on idle database client", err);
    process.exit(-1)
})

process.on("SIGINT", async () => {
    console.log("Closing database connection...");
    await pool.end();
    console.log("Database connection closed.");
    process.exit(0);
});

export const query = (statement, params) => {
    try {
        const result = pool.query(statement, params)
        return result
    } catch (error) {
        console.log("Database query error", {statement, params, error: error});
        throw error
    }   
}
