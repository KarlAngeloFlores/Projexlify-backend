const db = require('../config/db');

const userModel = {
    findUserByEmail: async (email) => {
        const query = `SELECT id, email, password FROM users WHERE email = ?`;
        const [rows] = await db.query(query, [email]);
        return rows[0];
    },
    createUser: async (email, password, username) => {
        const query = `INSERT INTO users (email, password, username) VALUES (?, ?, ?)`;
        const [result] = await db.query(query, [email, password, username]);
        return result;
    },
    createNewPassword: async (email, password) => {
        const query = `UPDATE users SET password = ? WHERE email = ?;`;
        const [result] = await db.query(query, [password, email]);
        return result;
    },
    findUsername: async (username) => {
        const query = `SELECT username FROM users WHERE username = ?;`;
        const [rows] = await db.query(query, [username]);
        return rows[0];
    },
    findUserById: async (id) => {
        const query = `SELECT id, email, username FROM users WHERE id = ?;`;
        const [rows] = await db.query(query, [id]);
        return rows[0];
    },
    
    /**
     * @verification
     */

    insertVerificationCodeByEmail: async (email, code_hash, purpose, expires_at) => {
        const query = `INSERT INTO verification_codes (email, code_hash, purpose, expires_at) VALUES (?, ?, ?, ?)`;
        const [result] = await db.query(query, [email, code_hash, purpose, expires_at]);
        return result;
    },

    deleteVerificationCodeByEmail: async (email, purpose) => {
        const query = `DELETE FROM verification_codes WHERE email = ? AND purpose = ?`;
        const [result] = await db.query(query, [email, purpose]);
        return result;
    },

    findVerificationCodeByEmail: async (email, purpose) => {
        const query = `SELECT * FROM verification_codes WHERE email = ? AND purpose = ?`;
        const [rows] = await db.query(query, [email, purpose]);
        return rows[0];
    }
}

module.exports = userModel;