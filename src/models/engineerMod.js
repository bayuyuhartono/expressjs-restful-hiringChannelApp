const conn = require('../configs/conn')

module.exports = {
  getUser: (email) => {
    const query = `SELECT id,email,password FROM engineer WHERE email = '${email}'`
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

  getEngineer: (req, counter) => {
    let startRec = 0
    const LimitPage = 10

    if (req.query.page && isNaN(req.query.page) === false) {
      startRec = LimitPage * req.query.page - LimitPage
    }

    let searchBy = ''
    if ((req.query.searchBy && req.query.keyword && (req.query.searchBy === 'name')) || (req.query.searchBy === 'skill')) {
      searchBy = ` WHERE ${req.query.searchBy} LIKE '%${req.query.keyword}%' `
    }
    let sortBy = 'name'
    if ((req.query.sortBy && (req.query.sortBy === 'name')) || req.query.sortBy === 'skill' || req.query.sortBy === 'date_updated') {
      sortBy = req.query.sortBy
      if (req.query.order) {
        if (req.query.order === 'DESC' || req.query.order === 'ASC') {
          sortBy = ` ${req.query.sortBy} ${req.query.order}`
        }
      }
    }
    let query = `SELECT * FROM engineer ${searchBy} ORDER BY ${sortBy} limit ${LimitPage} OFFSET ${startRec}`
    if (counter) {
      query = `Select count(*) as TotalCount from engineer ${searchBy} ORDER BY ${sortBy}`
    }
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

  getEngineerSingle: (id) => {
    const query = 'SELECT * FROM engineer WHERE id = ? ORDER BY name'
    return new Promise((resolve, reject) => {
      conn.query(query, id, (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },

  storeEngineer: (data) => {
    const query = 'INSERT INTO engineer SET ?'
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

  updateEngineer: (data) => {
    const query = 'UPDATE  engineer  SET  name = ?, description = ?, skill = ?, location = ?, date_of_birth = ?, showcase = ?, date_updated = ? WHERE id = ?'
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

  deleteEngineer: (id) => {
    const query = 'DELETE FROM engineer WHERE id = ?'
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
