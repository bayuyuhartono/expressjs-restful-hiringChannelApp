// import dependencies
require('dotenv/config')
const express = require('express')
const bodyParser = require('body-parser') // camel case
const timest = require('express-timestamp')
const index = require('./src/index')

// use dependencies
const app = express()
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*') // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

// use middleware for incoming request
app.use(bodyParser.json()) // parsing json
app.use(bodyParser.urlencoded({ extended: true })) // parsing x-www-form-urlencoded
app.use(timest.init)
app.use(express.static('public'))
app.use(index)

// listen to connection with callback function
app.listen(3000, () => {
  console.log('Server is running on port 3000!')
})
