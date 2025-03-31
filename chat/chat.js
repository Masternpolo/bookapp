const { Server } = require("socket.io");
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const AppError = require('../utils/AppError')

const socketHandler = (server) => {
  const io = new Server(server);

  io.use((socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie || '');
      const accessToken = cookies.token;

      jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          return next(new AppError(`Authentication error`, 403));
        }
        socket.user = user;
        next()
      })
    } catch (err) {
      next(new AppError('Authentication failed', 403));
    }
  });

  io.on('connection', (socket) => {
    console.log(socket.user.username, 'is online');


    socket.on('disconnect', () => {
      console.log(`${socket.user.username} is offline`);
    });

    socket.on('chat', (data) => {
      console.log(data);
      io.emit('chat', { user: socket.user.username, id: socket.user.id, message: data });
    });
  });
  return io
};

module.exports = socketHandler;