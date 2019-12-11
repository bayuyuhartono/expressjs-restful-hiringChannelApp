require('dotenv/config')
const express = require('express')
const router = express.Router()
const jwtmiddleware = require('../middleware/jwtMiddleware')
const cachemiddleware = require('../middleware/cacheMiddleware')
const uploadmiddleware = require('../middleware/uploadMiddleware')
const engineerCon = require('../controllers/engineerCon')
const companyCon = require('../controllers/companyCon')
const messageCon = require('../controllers/messageCon')

module.exports = router
// engineer --------------
router.route('/engineer/login').post(engineerCon.authi)

router.route('/engineer').get(jwtmiddleware.jwtCheckingGlobal, cachemiddleware.checkCache, engineerCon.index)
router.route('/engineer/:id').get(jwtmiddleware.jwtCheckingGlobal, cachemiddleware.checkCache, engineerCon.show)

router.route('/engineer').post(uploadmiddleware.upload.single('showcase'), engineerCon.create)
router.route('/engineer/:id').put(jwtmiddleware.jwtCheckingEngineer, uploadmiddleware.upload.single('showcase'), engineerCon.update)
router.route('/engineer/:id').delete(jwtmiddleware.jwtCheckingEngineer, engineerCon.deleting)

// company ----------------
router.route('/company/login').post(companyCon.authi)

router.route('/company').get(jwtmiddleware.jwtCheckingGlobal, cachemiddleware.checkCache, companyCon.index)
router.route('/company/:id').get(jwtmiddleware.jwtCheckingGlobal, cachemiddleware.checkCache, companyCon.show)

router.route('/company').post(uploadmiddleware.upload.single('logo'), companyCon.create)
router.route('/company/:id').put(jwtmiddleware.jwtCheckingCompany, uploadmiddleware.upload.single('logo'), companyCon.update)
router.route('/company/:id').delete(jwtmiddleware.jwtCheckingCompany, companyCon.deleting)

// message -----------------
router.route('/messages').get(jwtmiddleware.jwtCheckingGlobal, messageCon.index)
router.route('/message').post(jwtmiddleware.jwtCheckingGlobal, messageCon.create)
