const { promisify } = require('util');
const db = require('../database/db');
const query = promisify(db.query).bind(db);

class Book {


    async addBook(title, author, genre, year, imgpath) {

        try {
            title = title.toLowerCase();
            author = author.toLowerCase();
            genre = genre.toLowerCase();
            year = year * 1

            const sql = `INSERT INTO books (title, author, genre, year, cover_image_url) VALUES(?,?,?,?,?)`;
            const result = await query(sql, [title, author, genre, year, imgpath]);
            
            return 'Book uploded sucessfully';
            
        } catch (error) {
            console.error("Database Error:", error);
            throw error;
        }
    }

    async displayBooks(limit,offset) {
        try {
            const sql = `SELECT * FROM books LIMIT ? OFFSET ?`;
            const sql1 = 'SELECT COUNT(*) AS total FROM books';

            const booksNo = await query(sql1);
            let totalBooks = booksNo[0].total;
            
            let totalPages = Math.ceil(totalBooks / limit);

            const result = await query(sql, [limit, offset]);

            return {books: result, totalPages};
            
        } catch (error) {
            console.error("Database Error:", error);
            throw error;
        }

    }

    async getBook(id) {
        try {
            const sql = `SELECT * FROM books WHERE id = ?`;
            const result = await query(sql, [id]);
            return result[0] || null;
        } catch (error) {
            console.error("Database Error:", error);
            throw error;
        }

    }

    async updateBook(title, author, genre, year, id) {
        try {
            const sql = `UPDATE books SET title = ?, author = ?, year = ?, genre = ? WHERE id = ?`;
            const book = db.query(sql, [title, author, year, genre, id]);
            return book;
        } catch (error) {
            console.error("Database Error:", error);
            throw error;
        }
    }

    async searchBook(booktitle) {
        try {
            const sql = `SELECT * FROM books WHERE title = ?`;
            const result = await query(sql, [booktitle]);
            return result;
        } catch (error) {
            console.error("Database Error:", error);
            throw error;
        }

    }

    async filterBy(genreType) {
        try {
            const sql = `SELECT * FROM books WHERE genre = ?`;
            const result = await query(sql, [genreType]);
            return result;
        } catch (error) {
            console.error("Database Error:", error);
            throw error;
        }

    }

    async deleteBook(id) {
        try {
            const sql = `DELETE FROM books WHERE id = ?`;
            console.log('inside delete model');
            
            const result = await query(sql, [id]);
            return 'Book deleted';
        } catch (error) {
            console.error("Database Error:", error);
            throw error;
        }

    }
}




module.exports = Book;