const jwt = require('jsonwebtoken')
const User = require('../models/users.model');

const isLoggedIn = async(req, res, next) => {
  let token;

  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');
      next()

    }

    if (!token) throw new Error("Not authorized, no Bearer token")

  } catch(err) {
    res.status(401)
    next(err)
  }
}

const isAdmin = (req, res, next) => {
  if (req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({
      message: "Unauthorized access - only limited to Admin users"
    })
  }
}

module.exports = { isLoggedIn, isAdmin }