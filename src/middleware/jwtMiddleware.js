const jwt = require('jsonwebtoken')

module.exports = {
  jwtCheckingGlobal: (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const decodeToken = jwt.verify(token, process.env.JWT_KEY)
      if (decodeToken && decodeToken.email === req.headers.email) {
        next()
      } else {
        res.status(403).json({
          status: 403,
          error: true,
          message: 'Invalid email Token'
        })
      }
    } catch (err) {
      console.log(req.headers)
      res.status(403).json({
        status: 403,
        error: true,
        message: 'Invalid Token'
      })
    }
  },

  jwtCheckingCompany: (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const decodeToken = jwt.verify(token, process.env.JWT_KEY)
      if (decodeToken && decodeToken.email === req.headers.email) {
        if (decodeToken.who === 'company') {
          next()
        } else {
          res.status(403).json({
            status: 403,
            error: true,
            message: 'Forbidden Access'
          })
        }
      } else {
        res.status(403).json({
          status: 403,
          error: true,
          message: 'Invalid email Token'
        })
      }
    } catch (err) {
      console.log(req.headers)
      res.status(403).json({
        status: 403,
        error: true,
        message: 'Invalid Token'
      })
    }
  },

  jwtCheckingEngineer: (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const decodeToken = jwt.verify(token, process.env.JWT_KEY)
      if (decodeToken && decodeToken.email === req.headers.email) {
        if (decodeToken.who === 'engineer') {
          next()
        } else {
          res.status(403).json({
            status: 403,
            error: true,
            message: 'Forbidden Access'
          })
        }
      } else {
        res.status(403).json({
          status: 403,
          error: true,
          message: 'Invalid email Token'
        })
      }
    } catch (err) {
      console.log(req.headers)
      res.status(403).json({
        status: 403,
        error: true,
        message: 'Invalid Token'
      })
    }
  }
}
