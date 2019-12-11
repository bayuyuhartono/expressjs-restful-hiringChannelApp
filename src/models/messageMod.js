const conn = require('../configs/conn')

module.exports = {
  getMessages: (idCompany, idEngineer) => {
    const query = `SELECT * FROM message WHERE idCompany = '${idCompany}' AND idEngineer = '${idEngineer}' ORDER BY date_created DESC`
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

  storeMessage: (data) => {
    const query = 'INSERT INTO message SET ?'
    return new Promise((resolve, reject) => {
      conn.query(query, data, (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  }
}
