const jwt = require('jsonwebtoken')

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  if (!authHeader)
    return res.status(401).send('Access denied. No token provided.')

  const token = authHeader.split(' ')[1]
  if (!token) return res.status(401).send('Access denied. No token provided.')

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (ex) {
    res.status(400).send(ex);
  }
}

exports.admin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).send('Access denied.')
  next()
}