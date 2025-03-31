const AppError = require('../utils/AppError')

module.exports = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next()
    } else {
        next(new AppError(`Unathorized. You're not an admin`, 403))
    }
};