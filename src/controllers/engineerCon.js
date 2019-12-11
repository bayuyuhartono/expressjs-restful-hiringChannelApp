require('dotenv/config')
const uuidv4 = require('uuid/v4')
const jwt = require('jsonwebtoken')
const engineerMod = require('../models/engineerMod')
var template = require('../middleware/responseMiddleware')
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10)
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
let requireCheck = []

module.exports = {
  authi: (req, res) => {
    const {
      email,
      password
    } = req.body
    if (!email) {
      requireCheck.push('Email is required')
    }
    if (!emailRegex.test(email)) {
      requireCheck.push('email not valid')
    } 
    if (!password) {
      requireCheck.push('Password is required')
    }
    if (requireCheck.length) {
      return template.tmpErr(res, requireCheck, 400)
    }

    engineerMod.getUser(email)
      .then(result => {
        const dataId = result[0].id
        const dataEmail = result[0].email
        const dataPass = result[0].password
        var hashChecking = bcrypt.compareSync(password, dataPass)
        if (!hashChecking) {
          template.tmpErr(res, 'Login Failed', 400)
        } else {
          const token = jwt.sign({ who: 'engineer', email: dataEmail, id: dataId }, process.env.JWT_KEY, { expiresIn: '1h' })
          result[0].token = token
          template.tmpNormal(result, res, 'Login Success', 201)
        }
      })
      .catch(err => {
        template.tmpErr(res, 'email not found', 400)
      })
  },

  index: (req, res) => {
    engineerMod.getEngineer(req, 'count')
      .then(result => {
        let page = 1
        if (req.query.page && isNaN(req.query.page) === false) {
          page = req.query.page
        }
        // store Total count in variable
        const totalCount = result[0].TotalCount
        let totalpage = 1
        if (totalCount > 10) {
          totalpage = Math.floor(totalCount / 10)
          if (totalpage % 10 !== 0) {
            totalpage++
          }
        }
        const pagingInfo = {
          total_page: totalpage.toString(),
          this_page: page.toString(),
          total_record: totalCount.toString(),
          record_in_this_page: result.length.toString()
        }

        engineerMod.getEngineer(req)
          .then(result => {
            template.tmpEngineers(result, res, 'Success Get Engineers', pagingInfo, req.originalUrl)
          })
          .catch(err => {
            template.tmpErr(res, err, 404)
          })
      })
      .catch(err => {
        template.tmpErr(res, err, 404)
      })
  },

  show: (req, res) => {
    const id = req.params.id
    engineerMod.getEngineerSingle(id)
      .then(result => {
        if (result.length === 0) {
          template.tmpErr(res, 'Not Found', 404)
        } else {
          template.tmpNormal(result, res, 'Success Get Engineer', 200, req.originalUrl)
        }
      })
      .catch(err => {
        template.tmpErr(res, err, 404)
      })
  },

  create: (req, res) => {
    const id = uuidv4() // generate new id
    const {
      createEmail,
      createPassword,
      name,
      description,
      skill,
      location,
      dateOfBirth
    } = req.body

    if (!createEmail) {
      requireCheck.push('createEmail is required')
    }
    if (!emailRegex.test(createEmail)) {
      requireCheck.push('email not valid')
    } 
    if (!createPassword) {
      requireCheck.push('createPassword is required')
    }
    if (!name) {
      requireCheck.push('name is required')
    }
    if (!description) {
      requireCheck.push('description is required')
    }
    if (!skill) {
      requireCheck.push('skill is required')
    }
    if (!location) {
      requireCheck.push('location is required')
    }
    if (!dateOfBirth) {
      requireCheck.push('dateOfBirth is required')
    }
    if (!req.file) {
      requireCheck.push('File for showcase is Required')
    }

    if (requireCheck.length) {
      return template.tmpErr(res, requireCheck, 400)
    }

    const moment = req.timestamp
    const dateCreated = moment.tz('Asia/Jakarta').format()
    const dateUpdated = moment.tz('Asia/Jakarta').format()
    const showcase = process.env.BASE_URL + '/images/' + req.file.filename
    const hashPassword = bcrypt.hashSync(createPassword, salt)
    const data = {
      id,
      email: createEmail,
      password: hashPassword,
      name,
      description,
      skill,
      location,
      dateOfBirth,
      showcase,
      dateCreated,
      dateUpdated
    }
    engineerMod.getUser(data.email)
      .then(result => {
        if (result.length === 0) {
          engineerMod.storeEngineer(data)
            .then(result => {
              console.log(1)
              template.tmpNormal(result, res, 'Success Create New Engineer', 201, null, true)
            })
            .catch(err => {
              console.log(2)
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
      description,
      skill,
      location,
      dateOfBirth
    } = req.body
    var moment = req.timestamp
    var dateUpdated = moment.tz('Asia/Jakarta').format()
    const showcase = process.env.BASE_URL + '/images/' + req.file.filename
    const data = [
      name,
      description,
      skill,
      location,
      dateOfBirth,
      showcase,
      dateUpdated,
      id
    ]
    engineerMod.updateEngineer(data)
      .then(result => {
        template.tmpNormal(result, res, 'Success Update Engineer', 200)
      })
      .catch(err => {
        template.tmpErr(res, err, 400)
      })
  },

  deleting: (req, res) => {
    const id = req.params.id
    engineerMod.deleteEngineer(id)
      .then(result => {
        template.tmpNormal(result, res, 'Data Engineer Deleted', 201, null, true)
      })
      .catch(err => {
        template.tmpErr(res, err, 400)
      })
  }
}
