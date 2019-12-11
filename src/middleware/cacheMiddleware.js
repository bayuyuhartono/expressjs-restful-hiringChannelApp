const redis = require('redis')
const redisClient = redis.createClient()

module.exports = {
  checkCache: (req, res, next) => {
    const key = req.originalUrl

    redisClient.get(key, (err, data) => {
      if (err) {
        res.status(500).send(err)
      }
      // if no match found
      if (data != null) {
        res.send(JSON.parse(data))
      } else {
        // proceed to next middleware function
        next()
      }
    })
  },

  checkCacheEngineer: (req, res, next) => {
    const { id } = req.params
    let key = 'engineer:' + id
    if (!id) {
      key = 'engineers'
    }
    redisClient.get(key, (err, data) => {
      if (err) {
        res.status(500).send(err)
      }
      // if no match found
      if (data != null) {
        res.send(JSON.parse(data))
      } else {
        // proceed to next middleware function
        next()
      }
    })
  }
}
