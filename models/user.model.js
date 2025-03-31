const bcrypt = require('bcrypt');
const { promisify } = require('util');
const db = require('../database/db');
const query = promisify(db.query).bind(db);

class User {
    async register(username, password, email, role) {
        try {
            username = username.toLowerCase();
            email = email.toLowerCase();
            const hashedPassword = await bcrypt.hash(password, 10);

            const sql = `INSERT INTO users(username, passwordz, email, role) VALUES (?, ?, ?, ?)`;
            const result = await query(sql, [username, hashedPassword, email, role]);

            return { message: "Registration successful", id: result.insertId };
        } catch (error) {
            console.error("Database Error:", error);
            throw error;
        }
    }

    async authenticate(username, password) {
        try {
            const sql = `SELECT * FROM users WHERE username = ?`;
            const result = await query(sql, [username]);

            if (result.length === 0) {
                console.log("User not found");
                return null;
            }

            const user = result[0];
            const passwordMatch = await bcrypt.compare(password, user.passwordz);
            
            return passwordMatch ? user : null;
        } catch (error) {
            console.error("Database Error:", error);
            throw error;
        }
    }

    async validateEmail(email) {
        try {
            const sql = `SELECT * FROM users WHERE email = ?`;
            const result = await query(sql, [email]);
            return result.length > 0;
        } catch (error) {
            console.error("Database Error:", error);
            throw error;
        }
    }

    async validateUsername(username) {
        try {
            const sql = `SELECT * FROM users WHERE username = ?`;
            const result = await query(sql, [username]);
            return result.length > 0;
        } catch (error) {
            console.error("Database Error:", error);
            throw error;
        }
    }

    async getAllUsers() {
        try {
            const sql = `SELECT username, id, email FROM users`;
            const result = await query(sql);
            return result;
        } catch (error) {
            console.error("Database Error:", error);
            throw error;
        }
    }
}

module.exports = User;
