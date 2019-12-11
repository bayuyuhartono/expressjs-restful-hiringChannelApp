require('dotenv/config')
const uuidv4 = require('uuid/v4')
const messageMod = require('../models/messageMod')
var template = require('../middleware/responseMiddleware')

module.exports = {
  index: (req, res) => {
    const idCompany = req.body.idCompany
    const idEngineer = req.body.idEngineer
    messageMod.getMessages(idCompany, idEngineer)
      .then(result => {
        if (result.length === 0) {
          template.tmpErr(res, 'Not Found', 404)
        } else {
          template.tmpNormal(result, res, 'Success Get Messages', 200)
        }
      })
      .catch(err => {
        template.tmpErr(res, err, 404)
      })
  },

  create: (req, res) => {
    const id = uuidv4() // generate new id
    const {
      idCompany,
      idEngineer,
      sender,
      body
    } = req.body
    const moment = req.timestamp
    const dateCreated = moment.tz('Asia/Jakarta').format()
    const dateUpdated = moment.tz('Asia/Jakarta').format()
    const data = {
      id,
      idCompany,
      idEngineer,
      sender,
      body,
      dateCreated,
      dateUpdated
    }
    messageMod.storeMessage(data)
      .then(result => {
        template.tmpNormal(result, res, 'Success Create New Message', 201, null, true)
      })
      .catch(err => {
        template.tmpErr(res, err, 400)
      })
  }
}
