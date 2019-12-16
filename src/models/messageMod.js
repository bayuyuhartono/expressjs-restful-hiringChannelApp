const conn = require('../configs/conn')

module.exports = {
  getMessages: (idCompany, idEngineer) => {
    const query = `SELECT * FROM message WHERE idCompany = '${idCompany}' AND idEngineer = '${idEngineer}' ORDER BY dateCreated DESC`
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
  },

  statusUpdate: (idCompany, idEngineer, who) => {
    let query = ''
    if (who === 'company') {
      query = `UPDATE message SET readStatus = 'true' WHERE idEngineer = ${idEngineer} AND idCompany = ${idCompany} AND sender = 'engineer'`
    }
    console.log(query)
    if (who === 'engineer') {
      query = `UPDATE message SET readStatus = 'true' WHERE idEngineer = ${idEngineer} AND idCompany = ${idCompany} AND sender = 'company'`
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
  }
}
