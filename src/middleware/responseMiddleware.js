const redis = require('redis')
const redisClient = redis.createClient()

module.exports = {
  tmpNormal: (values, res, message, numb, redisNeeded, passDelete) => {
    if (!passDelete) {
      delete values[0].password
    }
    var data = {
      status: numb,
      error: false,
      message: message,
      data: values
    }
    if (redisNeeded) {
      console.log(redisNeeded)
      redisClient.setex(redisNeeded, 3600, JSON.stringify(data))
    }
    res.json(data)
    res.end()
  },

  tmpErr: (res, message, numb) => {
    var data = {
      status: numb,
      error: true,
      message: message
    }
    res.json(data)
    res.end()
  },

  tmpEngineers: (values, res, message, pagingInfo, redisNeeded) => {
    var data = {
      status: 200,
      error: false,
      total_page: pagingInfo.total_page,
      this_page: pagingInfo.this_page,
      total_record: pagingInfo.total_record,
      record_in_this_page: pagingInfo.record_in_this_page,
      message: message,
      data: values
    }
    if (redisNeeded) {
      console.log(redisNeeded)
      redisClient.setex(redisNeeded, 3600, JSON.stringify(data))
    }
    res.json(data)
    res.end()
  }
}
