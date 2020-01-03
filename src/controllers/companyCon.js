require('dotenv/config')
const uuidv4 = require('uuid/v4')
const jwt = require('jsonwebtoken')
const companyMod = require('../models/companyMod')
var template = require('../middleware/responseMiddleware')
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10)
// const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const redis = require('redis')
const multer = require('multer')
const uploadmiddleware = require('../middleware/uploadMiddleware')
const redisClient = redis.createClient()

module.exports = {
  authi: (req, res) => {
    const {
      email,
      password
    } = req.body
    let requireCheck = []
    if (!email) {
      requireCheck.push('Email is required')
    }
    // if (!emailRegex.test(email)) {
    //   requireCheck.push('email not valid')
    // }
    if (!password) {
      requireCheck.push('Password is required')
    }
    if (requireCheck.length) {
      return template.tmpErr(res, requireCheck, 400)
    }

    companyMod.getUser(email)
      .then(result => {
        const dataId = result[0].email
        const dataEmail = result[0].email
        const dataPass = result[0].password
        const hashChecking = bcrypt.compareSync(password, dataPass)
        if (!hashChecking) {
          template.tmpErr(res, 'Login Failed', 400)
        } else {
          const token = jwt.sign({ who: 'company', email: dataEmail, id: dataId }, process.env.JWT_KEY, { expiresIn: '1h' })
          result[0].who = 'company'
          result[0].token = token
          template.tmpNormal(result, res, 'Login Success', 201)
        }
      })
      .catch(err => {
        template.tmpErr(res, err + 'email not found', 400)
      })
  },

  index: (req, res) => {
    companyMod.getCompany(req)
      .then(result => {
        if (result.length === 0) {
          template.tmpNormal([], res, 'Not Found', 200)
        } else {
          template.tmpNormal(result, res, 'Success Get Companys', 200, req.originalUrl)
        }
      })
      .catch(err => {
        template.tmpErr(res, err, 400)
      })
  },

  show: (req, res) => {
    const id = req.params.id
    companyMod.getCompanySingle(id)
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
    uploadmiddleware.upload(req, res, function (err) {
      const id = uuidv4() // generate new id
      const {
        createEmail,
        createPassword,
        name,
        location,
        description
      } = req.body
      let requireCheck = []
      let logo = '/images/nopicLogo.png'

      if (!createEmail) {
        requireCheck.push('createEmail is required')
      }
      // if (!emailRegex.test(createEmail)) {
      //   requireCheck.push('email not valid')
      // }
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
        if (err instanceof multer.MulterError) {
          if (err.message === 'File to large') {
            // A Multer error occurred when uploading.
            console.log(req.file)
            requireCheck.push('File to large, max size is 1mb')
          } else if (err) {
            // An unknown error occurred when uploading.
            requireCheck.push('Error upload')
          }
        }
      } else {
        logo = '/images/' + req.file.filename
      }

      if (requireCheck.length) {
        return template.tmpErr(res, file, 400)
      }

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
                redisClient.flushdb()
                template.tmpNormal(result, res, 'Success Create New Company', 201, null, true)
              })
              .catch(err => {
                template.tmpErr(res, err, 400)
              })
          } else {
            template.tmpNormal([],res, 'email was taken', 200)
          }
        })
        .catch(err => {
          template.tmpErr(res, err, 400)
        })
    })
  },

  update: (req, res) => {
    uploadmiddleware.upload(req, res, function (err) {
      const id = req.params.id
      const {
        name,
        location,
        description
      } = req.body
      let requireCheck = []
      let logo = ''

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
        if (err instanceof multer.MulterError) {
          if (err.message === 'File to large') {
            // A Multer error occurred when uploading.
            console.log(req.file)
            requireCheck.push('File to large, max size is 1mb')
          } else if (err) {
            // An unknown error occurred when uploading.
            requireCheck.push('Error upload')
          }
        } 
      } else {
        logo = '/images/' + req.file.filename
      }

      if (requireCheck.length) {
        return template.tmpErr(res, 'requireCheck', 400)
      }
      let fileNeeded = true
      let data = [
        name,
        logo,
        location,
        description,
        id
      ]
      if (!logo) {
        fileNeeded = false
        data = [
          name,
          location,
          description,
          id
        ]
      }

      companyMod.updateCompany(data,fileNeeded)
        .then(result => {
          redisClient.flushdb()
          template.tmpNormal(result, res, 'Success Update Data Company', 201, null, true)
        })
        .catch(err => {
          template.tmpErr(res, err, 400)
        })
    })
  },

  deleting: (req, res) => {
    const id = req.params.id
    companyMod.deleteCompany(id)
      .then(result => {
        redisClient.flushdb()
        template.tmpNormal(result, res, 'Data Company Deleted', 201, null, true)
      })
      .catch(err => {
        template.tmpErr(res, err, 400)
      })
  }
}
