const express = require('express')
const router = express.Router()

// import Routes
var routeNav = require('./routes/routes')

router
  .use('/api/v1', routeNav)

module.exports = router
