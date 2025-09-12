require('dotenv').config(); // MUST be at the top
const mysql = require('mysql2/promise');
const clc = require('cli-color');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
});

(async () => {
    try {
        const conn = await pool.getConnection();
        console.log(clc.bgGreen.black('Connected to Database'));
        conn.release();
    } catch (error) {
        console.log(clc.red('DB Connection Error:', error.message));
        process.exit(1);
    }
})();

module.exports = pool;
