const AppError = require('../utils/AppError');

// const handleDuplicateValueDB = (err)=>{
//     const message = err.message;
//     return new AppError(message, 400);
}

module.exports = ((err, req, res, next) =>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message;
    err.status = err.status || 'error'
    // Render errror page with the error message
    let error ={ ...err }

    // if (error.code==='ER_DUP_ENTRY') error = handleDuplicateValueDB(error);
    
    res.status(err.statusCode).render('error', {message:err.message, status:err.status})
});