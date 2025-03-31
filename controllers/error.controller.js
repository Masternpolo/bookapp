module.exports = ((err, req, res, next) =>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message;
    err.status = err.status || 'error'
    // Render errror page with the error message
    
    res.status(err.statusCode).render('error', {message:err.message, status:err.status})
});