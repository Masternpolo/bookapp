const { validationResult } = require('express-validator')
const Book = require('../models/book.model');
const newBook = new Book();
const AppError = require('../utils/AppError');
// const multer  = require('multer')




class Bookcontroller {

    async addBook(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).render('upload', { errors: errors.array(), message: null });
            }
            
            if(!req.file){
                next(new AppError(`No file uploaded`, 400));
            }
            const imgPath = `/uploads/${req.file.filename}`
          
            
            const { title, author, genre, year } = req.body;
            const message = await newBook.addBook(title, author, genre, year, imgPath);
            const user = req.user;
            
            console.log(message);
            
            res.status(201).render('showBook', { message, book:[], user });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async getBook(req, res, next) {
        try {
            const id = req.params.id * 1;

            const book = await newBook.getBook(id);

            if (!book) {
                next(new AppError(`No book with the id : ${id}`));
                // return res.status(200).render('edit', { message: "Invalid Book id", book });
            }
             res.status(200).render('edit', { message: null, book });
        } catch (error) {
            next(error)
        }
    }

    async getBookDelete(req, res, next) {
        try {
            const id = req.params.id * 1;
            const book = await newBook.getBook(id);

            if (!book) {
                next(new AppError(`No book with the id : ${id}`));
                // return res.status(200).render('edit', { message: "Invalid Book id", book });
            }
            return res.status(200).render('delete', { message: null, book });
        } catch (error) {
            next(error)
        }
    }

    async displayBook(req, res, next) {
        const page = req.query.page * 1 || 1;
        
        const limit = 8;
        const offset = (page - 1) * limit;
        try {
            const { books, totalPages } = await newBook.displayBooks(limit, offset);
            const user = req.user;
            
            res.status(200).render('library', { message: null, books, totalPages, currentPage: page, user })
        } catch (error) {
            next(error);
        }
    }

    async searchBook(req, res, next) {
        try {
            const user = req.user;
            const title = req.query.title;

            const book = await newBook.searchBook(title);
            if (book.length === 0) {
                return res.status(200).render('showBook', { message: 'Invalid Book Title', book: [], user });
            }
            res.status(200).render('showBook', { message: null, book, user });

        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async filterByGenre(req, res, next) {
        try {
            const user = req.user;
            const genre = req.query.genre;
            const book = await newBook.filterBy(genre);

            if (book.length === 0) {
                // return res.status(200).render('showBook', { message: `No book with genre type : ${genre} `, book: [], user });
               return AppError(`No book with genre type : ${genre} `, 400)
            }
            res.status(200).render('showBook', { message: null, book, user });
        } catch (error) {
            next(error);
        }
    }


    async updateBook(req, res, next) {
        try {
            const { title, author, genre, year } = req.body;
            const bookId = req.params.id *1;
            const book = await newBook.updateBook(title, author, genre, year, bookId);
            res.status(201).render('edit', { message: 'Book updated', book });
        } catch (error) {
            next(error);
        }
    }

    uploadBook(req, res) {
        return res.render('upload', { errors: [], message: null });
    }

    async deleteBook(req, res, next) {
        try {
            const bookId = req.params.id * 1;
            const user = req.user;
            
            const message = await newBook.deleteBook(bookId);
            return res.status(204).render('showBook', { message, user, book:[]});
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

}

module.exports = Bookcontroller;