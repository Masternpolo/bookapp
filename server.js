const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const cookieParser = require('cookie-parser');
const socketHandler = require('./chat/chat');
const port = process.env.PORT || 8000;
const userRoutes = require('./routes/user.route');
const bookRoutes = require('./routes/book.route');
const handleErrors = require('./controllers/error.controller');
const AppError = require('./utils/AppError');




app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/public',express.static('public'));
app.set('view engine', 'ejs');
app.use('/', userRoutes);
app.use('/', bookRoutes);


const io = socketHandler(server);

// const path = require('path');
app.use(express.static('public'));



app.all('*', (req, res, next) => {
  error = new AppError(`Can't find ${req.originalUrl} on this server`, 404)
  next(error);
});

app.use(handleErrors);

server.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});