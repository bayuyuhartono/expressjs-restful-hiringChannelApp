require('dotenv/config')
const express = require('express')
const router = express.Router()
const jwtmiddleware = require('../middleware/jwtMiddleware')
const cachemiddleware = require('../middleware/cacheMiddleware')
const engineerCon = require('../controllers/engineerCon')
const companyCon = require('../controllers/companyCon')
const messageCon = require('../controllers/messageCon')

module.exports = router
// engineer --------------
router.route('/engineer/login').post(engineerCon.authi)

router.route('/engineer').get(cachemiddleware.checkCache, engineerCon.index)
router.route('/engineer/:id').get(cachemiddleware.checkCache, engineerCon.show)

router.route('/engineer').post(engineerCon.create)
router.route('/engineer/:id').put(engineerCon.update)
router.route('/engineer/avatar/:id').put(engineerCon.updateShowcase)
router.route('/engineer/:id').delete(engineerCon.deleting)

// company ----------------
router.route('/company/login').post(companyCon.authi)

router.route('/company').get( cachemiddleware.checkCache, companyCon.index)
router.route('/company/:id').get( cachemiddleware.checkCache, companyCon.show)

router.route('/company').post( companyCon.create)
router.route('/company/:id').put(companyCon.update)
router.route('/company/avatar/:id').put(companyCon.updateLogo)
router.route('/company/:id').delete(companyCon.deleting)

// message -----------------
router.route('/messages').get( messageCon.index)
router.route('/message').post( messageCon.create)
