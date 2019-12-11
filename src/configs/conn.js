require('dotenv/config')
const mysqlcon = require('mysql')

// create db connection and store to variable
const conn = mysqlcon.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
})

// connect to db
conn.connect(err => {
  if (err) {
    console.log(`Error: \n ${err}`) // ES6 template literals
  } else {
    console.log('Success connect to database')
  }
})

module.exports = conn
