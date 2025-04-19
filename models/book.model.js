const pool = require('../database/db.js');


class Book {

    async addBook(title, author, genre, year, imgpath) {
        try {
            title = title.toLowerCase();
            author = author.toLowerCase();
            genre = genre.toLowerCase();
            year = year * 1;

            const sql = `INSERT INTO books (title, author, genre, year, cover_image_url) VALUES($1, $2, $3, $4, $5) RETURNING *`;
            const result = await pool.query(sql, [title, author, genre, year, imgpath]);
            return 'Book uploaded successfully';
        } catch (error) {
            console.error("Database Error in addBook :", error);
            throw error;
        }
    }

    async displayBooks(limit = 12, offset = 0) {
        try {
            const sql = `SELECT * FROM books ORDER BY id DESC LIMIT $1 OFFSET $2`;
            const sql1 = 'SELECT COUNT(*) AS total FROM books';

            const booksNo = await pool.query(sql1);
            let totalBooks = booksNo.rows[0].total *1;

            let totalPages = Math.ceil(totalBooks / limit);

            const result = await pool.query(sql, [limit, offset]);

            return { books: result.rows, totalPages };
        } catch (error) {
            console.error("Database Error in displayBook:", error);
            throw error;
        }
    }

    async getBook(id) {
        try {
            const sql = `SELECT * FROM books WHERE id = $1`;
            const result = await pool.query(sql, [id]);
            return result.rows[0] || null;
        } catch (error) {
            console.error("Database Error getBook:", error);
            throw error;
        }
    }

    async updateBook(title, author, genre, year, id) {
        title = title.toLowerCase();
        author = author.toLowerCase();
        genre = genre.toLowerCase();
        year = year * 1;

        try {
            const sql = `UPDATE books SET title = $1, author = $2, year = $3, genre = $4 WHERE id = $5 RETURNING *`;
            const result = await pool.query(sql, [title, author, year, genre, id]);
            return result.rows[0];
        } catch (error) {
            console.error("Database Error in updateBook:", error);
            throw error;
        }
    }

    async searchBook(booktitle) {
        booktitle = `%${booktitle.toLowerCase()}%`;
        try {
            const sql = `SELECT * FROM books WHERE title ILIKE $1`;
            const result = await pool.query(sql, [booktitle]);
            return result.rows;
        } catch (error) {
            console.error("Database Error in searchBook :", error);
            throw error;
        }
    }


    async filterBy(genreType) {
        genreType = `%${genreType.toLowerCase()}%`;

        try {
            const sql = `SELECT * FROM books WHERE genre ILIKE $1`;
            const result = await pool.query(sql, [genreType]);
            return result.rows;
        } catch (error) {
            console.error("Database Error in filterBook:", error);
            throw error;
        }
    }

    async deleteBook(id) {
        try {
            const sql = `DELETE FROM books WHERE id = $1 RETURNING *`;
            const result = await pool.query(sql, [id]);

            if (result.rowCount === 0) {
                return 'No book found with this ID';
            }

            return 'Book deleted';
        } catch (error) {
            console.error("Database Error in deleteBook:", error);
            throw error;
        }
    }

}

module.exports = Book;
