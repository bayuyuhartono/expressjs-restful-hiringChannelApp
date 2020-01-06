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
    let LimitPage = 5
    if (req.query.limit) {
      LimitPage = parseInt(req.query.limit)
      console.log(LimitPage)
    }

    if (req.query.page && isNaN(req.query.page) === false) {
      startRec = LimitPage * (req.query.page - 1)
    }

    let searchBy = ''
    if ((req.query.searchBy && req.query.keyword && (req.query.searchBy === 'name')) || (req.query.searchBy === 'skill')) {
      searchBy = ` WHERE ${req.query.searchBy} LIKE '%${req.query.keyword}%' `
    }
    let sortBy = 'name'
    if ((req.query.sortBy && (req.query.sortBy === 'name')) || req.query.sortBy === 'skill' || req.query.sortBy === 'dateUpdated') {
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
    console.log(query)
    return new Promise((resolve, reject) => {
      conn.query(query, (err, result) => {
        if (!err) {
          if (result.length) {
            result[0].currentCount = result.length.toString()
          }
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

  updateEngineer: (data,fileNeded) => {
    let query = 'UPDATE  engineer  SET  name = ?, description = ?, skill = ?, location = ?, dateOfBirth = ?, expectedSallary = ?, showcase = ?, dateUpdated = ? WHERE id = ?'
    if (!fileNeded) {
      query = 'UPDATE  engineer  SET  name = ?, description = ?, skill = ?, location = ?, dateOfBirth = ?, expectedSallary = ?, dateUpdated = ? WHERE id = ?'
    }
    console.log(query + data)
    return new Promise((resolve, reject) => {
      conn.query(query, data, (err, result) => {
        if (!err) {
          console.log(2)
          resolve(result)
        } else {
          reject(new Error(query))
        }
      })
    })
  },

  updateShowcase: (data) => {
    let query = 'UPDATE  engineer  SET  showcase = ?, dateUpdated = ? WHERE id = ?'
    console.log(query + data)
    return new Promise((resolve, reject) => {
      conn.query(query, data, (err, result) => {
        if (!err) {
          console.log(2)
          resolve(result)
        } else {
          reject(new Error(query))
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
