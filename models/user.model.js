const bcrypt = require('bcryptjs');
const pool = require('../database/db');

class User {
    async register(username, password, email, role) {
        try {
            username = username.toLowerCase();
            email = email.toLowerCase();
            const hashedPassword = await bcrypt.hash(password, 10);

            const sql = `INSERT INTO users(username, password, email, role) VALUES ($1, $2, $3, $4) RETURNING id`;
            const result = await pool.query(sql, [username, hashedPassword, email, role]);

            return result.rows[0].id;
        } catch (error) {
            console.error("Database Error:", error);
            throw error;
        }
    }

    async authenticate(username, password) {
        username = username.toLowerCase();

        try {
            const sql = `SELECT * FROM users WHERE username = $1`;
            const result = await pool.query(sql, [username]);

            if (result.rows.length === 0) return null;

            const user = result.rows[0];
            const passwordMatch = await bcrypt.compare(password, user.password);

            return passwordMatch ? user : null;
        } catch (error) {
            console.error("Database Error in authenticate:", error);
            throw error;
        }
    }

    async validateEmail(email) {
        email = email.toLowerCase();

        try {
            const sql = `SELECT * FROM users WHERE email = $1`;
            const result = await pool.query(sql, [email]);
            return result.rows.length > 0;
        } catch (error) {
            console.error("Database Error validateEmail:", error);
            throw error;
        }
    }

    async validateUsername(username) {
        username = username.toLowerCase();

        try {
            const sql = `SELECT * FROM users WHERE username = $1`;
            const result = await pool.query(sql, [username]);
            return result.rows.length > 0;
        } catch (error) {
            console.error("Database Error in validateUsername:", error);
            throw error;
        }
    }

    async getAllUsers() {
        try {
            const sql = `SELECT username, id, email FROM users`;
            const result = await pool.query(sql);
            return result.rows;
        } catch (error) {
            console.error("Database Error in getAllUsers:", error);
            throw error;
        }
    }
}


module.exports = User;
