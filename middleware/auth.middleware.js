const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const accessToken = req.cookies.token;

  // console.log(token);

  if (!accessToken) return res.redirect('login');

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
        return res.redirect('login');
      }
      req.user = user;
      // console.log(user);
      next()
    })
}

module.exports = auth;