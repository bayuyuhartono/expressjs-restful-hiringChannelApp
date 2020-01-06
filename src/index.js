const express = require('express')
const router = express.Router()
var cors = require('cors')

// import Routes
var routeNav = require('./routes/routes')
// cors
router.use(cors())

router
  .use('/api/v1', routeNav)

module.exports = router
