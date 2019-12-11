const conn = require('../configs/conn')

module.exports = {
  getUser: (email) => {
    const query = `SELECT id,email,password FROM company WHERE email = '${email}'`
    return new Promise((resolve, reject) => {
      conn.query(query, (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },

  getCompany: (id) => {
    let wh = ''
    if (id) {
      wh = `WHERE id = '${id}'`
    }
    const query = `SELECT * FROM company ${wh}`
    return new Promise((resolve, reject) => {
      conn.query(query, (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },

  storeCompany: (data) => {
    const query = 'INSERT INTO company SET ?'
    return new Promise((resolve, reject) => {
      conn.query(query, data, (err, result) => {
        if (!err) {
          console.log(111)
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },

  updateCompany: (data) => {
    const query = 'UPDATE company SET name = ?, logo = ?, location = ?, description = ? WHERE id = ?'
    return new Promise((resolve, reject) => {
      conn.query(query, data, (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },

  deleteCompany: (id) => {
    const query = 'DELETE FROM company WHERE id = ?'
    return new Promise((resolve, reject) => {
      conn.query(query, id, (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  }
}
