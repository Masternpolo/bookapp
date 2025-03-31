const { validationResult } = require('express-validator');
const User = require('../models/user.model');
const userModel = new User();
const jwt = require('jsonwebtoken');
require('dotenv').config();


class Usercontroller {

    async register(req, res, next) {
        try {
            //check for errors from validation
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).render('register', { errors: errors.array(), message: null });
            }

            let { username, password, email, role } = req.body;
            username = username.toLowerCase();
            email = email.toLowerCase();
            // check if username exists
            const userNameExists = await userModel.validateUsername(username);
            if (userNameExists) {
                return res.status(400).render('register', { errors: [], message: 'Username already exists' })
            }
            // check if email exist
            const userEmailExists = await userModel.validateEmail(email);
            if (userEmailExists) {
                return res.status(400).render('register', { errors: [], message: 'Email already exists' });
            }

            // register user
            const result = await userModel.register(username, password, email, role);
            res.status(201).render('login', { errors: [], message: 'User registered successfully' })
        } catch (error) {
            res.status(500).render('error', { message: error.message, status: 'error' });
        }
    }

    async authenticate(req, res, next) {
        try {
            // Check if validation errors exist
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).render('login', { errors: errors.array(), message: null });
            }
            // Destructure req.body
            let { username, password } = req.body;
            username = username.toLowerCase();

            const user = await userModel.authenticate(username, password);
            if (!user) {
                return res.status(401).render('login', { errors: [], message: 'Invalid username or password' });
            } else {
                // Generate access token
                const token = jwt.sign(
                    { "id": user.id, "username": user.username, role: user.role },
                    process.env.ACCESS_TOKEN_SECRET,
                    { "expiresIn": "15m" }
                );

                res.cookie('token', token, {
                    httpOnly: true,
                    maxAge: 3600000,
                })

                if (user.role === 'admin') {
                    res.render('adminDashboard', { user, message: null });
                } else {
                    req.user = user;
                    res.render('dashboard', { user, message: null });
                }
            }
        } catch (error) {
            res.status(500).render('error', { message: error.message, status: 'error' });
        }
    }

    async getAllusers(req, res, next) {
        try {
            // Check if validation errors exist
            const users = await userModel.getAllUsers();
            const user = req.user;

            if (!users || users.length === 0) {
                return res.status(200).render('getUsers', { user, users: [], message: 'No Users Currently' });
            }
            res.status(200).render('getUsers', { user, users, message: null });

        } catch (error) {
            res.status(500).render('error', { message: error.message, status: 'error' });
        }
    }


    async logOut(req, res, next) {
        try {
            const token = req.cookies.token;
            console.log(token);
            console.log('inside logout');
            console.log(req.cookies.token, 'no jwt');
            res.status(204).redirect('login');
        } catch (error) {
            res.status(500).render('error', { message: error.message, status: 'error' });
        }
    }
}

module.exports = Usercontroller;