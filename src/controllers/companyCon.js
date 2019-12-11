require('dotenv/config')
const uuidv4 = require('uuid/v4')
const jwt = require('jsonwebtoken')
const companyMod = require('../models/companyMod')
var template = require('../middleware/responseMiddleware')
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10)

module.exports = {
  authi: (req, res) => {
    const {
      email,
      password
    } = req.body
    companyMod.getUser(email)
      .then(result => {
        const dataId = result[0].email
        const dataEmail = result[0].email
        const dataPass = result[0].password
        var hashChecking = bcrypt.compareSync(password, dataPass)
        if (!hashChecking) {
          template.tmpErr(res, 'Login Failed', 400)
        } else {
          const token = jwt.sign({ who: 'company', email: dataEmail, id: dataId }, process.env.JWT_KEY, { expiresIn: '1h' })
          result[0].token = token
          template.tmpNormal(result, res, 'Login Success', 201)
        }
      })
      .catch(err => {
        template.tmpErr(res, err, 400)
      })
  },

  index: (req, res) => {
    companyMod.getCompany()
      .then(result => {
        template.tmpNormal(result, res, 'Success Get Companys', 200, req.originalUrl)
      })
      .catch(err => {
        template.tmpErr(res, err, 400)
      })
  },

  show: (req, res) => {
    const id = req.params.id
    companyMod.getCompany(id)
      .then(result => {
        if (result.length === 0) {
          template.tmpErr(res, 'Empty', 404)
        } else {
          template.tmpNormal(result, res, 'Success Get Company', 200, req.originalUrl)
        }
      })
      .catch(err => {
        template.tmpErr(res, err, 400)
      })
  },

  create: (req, res) => {
    const id = uuidv4() // generate new id
    const {
      createEmail,
      createPassword,
      name,
      location,
      description
    } = req.body

    const requireCheck = []

    if (!createEmail) {
      requireCheck.push('createEmail is required')
    }
    if (!createPassword) {
      requireCheck.push('createPassword is required')
    }
    if (!name) {
      requireCheck.push('name is required')
    }
    if (!location) {
      requireCheck.push('location is required')
    }
    if (!description) {
      requireCheck.push('description is required')
    }
    if (!req.file) {
      requireCheck.push('File for logo is Required')
    }

    if (requireCheck.length) {
      return template.tmpErr(res, requireCheck, 400)
    }

    const logo = process.env.BASE_URL + '/images/' + req.file.filename
    const hashPassword = bcrypt.hashSync(createPassword, salt)
    const data = {
      id,
      email: createEmail,
      password: hashPassword,
      name,
      logo,
      location,
      description
    }
    companyMod.getUser(data.email)
      .then(result => {
        if (result.length === 0) {
          companyMod.storeCompany(data)
            .then(result => {
              template.tmpNormal(result, res, 'Success Create New Company', 201, null, true)
            })
            .catch(err => {
              template.tmpErr(res, err, 400)
            })
        } else {
          template.tmpErr(res, 'email was taken', 400)
        }
      })
      .catch(err => {
        template.tmpErr(res, err, 400)
      })
  },

  update: (req, res) => {
    const id = req.params.id
    const {
      name,
      location,
      description
    } = req.body
    const logo = process.env.BASE_URL + '/images/' + req.file.filename
    const data = [
      name,
      logo,
      location,
      description,
      id
    ]
    companyMod.updateCompany(data)
      .then(result => {
        template.tmpNormal(result, res, 'Success Update Data Company', 201, null, true)
      })
      .catch(err => {
        template.tmpErr(res, err, 400)
      })
  },

  deleting: (req, res) => {
    const id = req.params.id
    companyMod.deleteCompany(id)
      .then(result => {
        template.tmpNormal(result, res, 'Data Company Deleted', 201, null, true)
      })
      .catch(err => {
        template.tmpErr(res, err, 400)
      })
  }
}
