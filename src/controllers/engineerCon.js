require('dotenv/config')
const uuidv4 = require('uuid/v4')
const jwt = require('jsonwebtoken')
const engineerMod = require('../models/engineerMod')
const template = require('../middleware/responseMiddleware')
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
    console.log(req.body)
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

    engineerMod.getUser(email)
      .then(result => {
        const dataId = result[0].id
        const dataEmail = result[0].email
        const dataPass = result[0].password
        const hashChecking = bcrypt.compareSync(password, dataPass)
        if (!hashChecking) {
          template.tmpErr(res, 'Login Failed', 400)
        } else {
          const token = jwt.sign({ who: 'engineer', email: dataEmail, id: dataId }, process.env.JWT_KEY, { expiresIn: '4h' })
          result[0].who = 'engineer'
          result[0].token = token
          template.tmpNormal(result, res, 'Login Success', 201)
        }
      })
      .catch(err => {
        template.tmpErr(res, err + 'email not found', 400)
      })
  },

  index: (req, res) => {
    engineerMod.getEngineer(req, 'count')
      .then(result => {
        let page = 1
        if (req.query.page && isNaN(req.query.page) === false) {
          page = req.query.page
        }
        // store Total count in constiable
        const totalCount = result[0].TotalCount
        let limit = 5
        if (req.query.limit) {
          limit = parseInt(req.query.limit)
        }
        let totalpage = 1
        if (totalCount > limit) {
          totalpage = Math.floor(totalCount / limit)
          console.log("ss" + totalpage % limit)
          if (totalpage % limit !== 0) {
            totalpage++
          }
        }
        const prevPage = parseInt(page) <= 1 ? page : parseInt(page) - 1
        // const nextPage = parseInt(page) === totalPage ? totalPage : parseInt(page) + 1
        const nextPage = parseInt(page) < totalpage ? parseInt(page) + 1 : parseInt(page) === totalpage ? page : parseInt(page) - 1
        const pagingInfo = {
          total_page: totalpage.toString(),
          current_page: page.toString(),
          total_record: totalCount.toString(),
          prevLink: `${req.originalUrl.replace('page=' + page, 'page=' + prevPage)}`,
          nextLink: `${req.originalUrl.replace('page=' + page, 'page=' + nextPage)}`
        }
        console.log(pagingInfo.nextLink)
        engineerMod.getEngineer(req)
          .then(result => {
            if (result.length === 0) {
              template.tmpNormal([], res, 'Not Found', 200)
            } else {
              template.tmpEngineers(result, res, 'Success Get Engineers', pagingInfo, req.originalUrl)
            }
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
    uploadmiddleware.uploadShowcase(req, res, function (err) {
      const id = uuidv4() // generate new id
      const {
        createEmail,
        createPassword,
        name,
        description,
        skill,
        location,
        dateOfBirth,
        age,
        expectedSallary
      } = req.body
      let requireCheck = []
      let showcase = '/images/nopic.png'

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
      if (!age) {
        requireCheck.push('aage is required')
      }
      if (!expectedSallary) {
        requireCheck.push('expectedSallary is required')
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
        showcase = '/images/' + req.file.filename
      }

      if (requireCheck.length) {
        return template.tmpErr(res, requireCheck, 400)
      }

      const moment = req.timestamp
      const dateCreated = moment.tz('Asia/Jakarta').format("YYYY-MM-DD HH")
      const dateUpdated = moment.tz('Asia/Jakarta').format("YYYY-MM-DD HH")
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
        age,
        expectedSallary,
        showcase,
        dateCreated,
        dateUpdated
      }
      engineerMod.getUser(data.email)
        .then(result => {
          if (result.length === 0) {
            engineerMod.storeEngineer(data)
              .then(result => {
                redisClient.flushdb()
                template.tmpNormal(result, res, 'Success Create New Engineer', 201, null, true)
              })
              .catch(err => {
                console.log(2)
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
    uploadmiddleware.uploadShowcase(req, res, function (err) {
      const id = req.params.id
      const {
        name,
        description,
        skill,
        location,
        dateOfBirth,
        expectedSallary,
      } = req.body
      let requireCheck = []
      let showcase = ''

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
      if (!expectedSallary) {
        requireCheck.push('expectedSallary is required')
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
        showcase = '/images/' + req.file.filename
      }

      if (requireCheck.length) {
        return template.tmpErr(res, requireCheck, 400)
      }

      const moment = req.timestamp
      const dateUpdated = moment.tz('Asia/Jakarta').format("YYYY-MM-DD HH")
      let fileNeeded = true
      let data = [
        name,
        description,
        skill,
        location,
        dateOfBirth,
        expectedSallary,
        showcase,
        dateUpdated,
        id
      ]
      if (!showcase) {
        fileNeeded = false
        data = [
          name,
          description,
          skill,
          location,
          dateOfBirth,
          expectedSallary,
          dateUpdated,
          id
        ]
      }
      
      engineerMod.updateEngineer(data,fileNeeded)
        .then(result => {
          redisClient.flushdb()
          template.tmpNormal(result, res, 'Success Update Engineer', 200, null, true)
        })
        .catch(err => {
          template.tmpErr(res, err + 'error model', 400)
        })
    })
  },

  updateShowcase: (req, res) => {
    uploadmiddleware.uploadShowcase(req, res, function (err) {
      const id = req.params.id
      let showcase = ''
      let requireCheck = []

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
        } else {
          requireCheck.push('File must be input ')
        }
      } else {
        showcase = '/images/' + req.file.filename
      }

      if (requireCheck.length) {
        return template.tmpErr(res, requireCheck, 400)
      }

      const moment = req.timestamp
      const dateUpdated = moment.tz('Asia/Jakarta').format("YYYY-MM-DD HH")
      let data = [
        showcase,
        dateUpdated,
        id
      ]
      
      engineerMod.updateShowcase(data)
        .then(result => {
          redisClient.flushdb()
          template.tmpNormal(result, res, 'Success Update Engineer Showcase', 200, null, true)
        })
        .catch(err => {
          template.tmpErr(res, err + 'error model', 400)
        })
    })
  },


  deleting: (req, res) => {
    const id = req.params.id
    engineerMod.deleteEngineer(id)
      .then(result => {
        redisClient.flushdb()
        template.tmpNormal(result, res, 'Data Engineer Deleted', 201, null, true)
      })
      .catch(err => {
        template.tmpErr(res, err, 400)
      })
  }
}
