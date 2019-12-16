// import dependencies
require('dotenv/config')
const express = require('express')
const bodyParser = require('body-parser') // camel case
const timest = require('express-timestamp')
const index = require('./src/index')

// use dependencies
const app = express()

// use middleware for incoming request
app.use(bodyParser.json()) // parsing json
app.use(bodyParser.urlencoded({ extended: true })) // parsing x-www-form-urlencoded
app.use(timest.init)
app.use(express.static('public'))
app.use(index)

// listen to connection with callback function
app.listen(3030, () => {
  console.log('Server is running on port 3030!')
})
