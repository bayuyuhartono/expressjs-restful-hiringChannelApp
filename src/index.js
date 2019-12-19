const express = require('express')
const router = express.Router()

// import Routes
var routeNav = require('./routes/routes')
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*') // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, email')
  next()
})
router
  .use('/api/v1', routeNav)

module.exports = router
