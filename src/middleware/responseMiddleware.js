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
      data.cache = true
      redisClient.setex(redisNeeded, 3600, JSON.stringify(data))
      delete data.cache
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
    const curr = values[0].currentCount
    delete values[0].currentCount
    delete values[0].password
    let prevCount = 0
    let nextCount = 0

    if (pagingInfo.current_page !== 1) {
      console.log(pagingInfo.total_page)
      prevCount = pagingInfo.current_page - 1
    }
    if (pagingInfo.current_page && pagingInfo.current_page < pagingInfo.total_page) {
      console.log(pagingInfo.total_page)
      nextCount = pagingInfo.current_page + 1
    }
    console.log(parseInt(prevCount))
    console.log(parseInt(nextCount))
    var data = {
      status: 200,
      error: false,
      total_page: pagingInfo.total_page,
      current_page: pagingInfo.current_page,
      total_record: pagingInfo.total_record,
      record_in_current_page: curr,
      prevPage: pagingInfo.prevLink,
      nextPage: pagingInfo.nextLink,
      message: message,
      data: values
    }
    if (redisNeeded) {
      data.cache = true
      redisClient.setex(redisNeeded, 3600, JSON.stringify(data))
      delete data.cache
    }
    res.json(data)
    res.end()
  }

  // tmpResponeSample : (res,status,error,message,data) => {
  //   let resultPrint = {}
  //   resultPrint.id = 'jhjnjlnjlnjl'
  //   resultPrint.status = status || 200
  //   resultPrint.error = error || false
  //   resultPrint.message = message || 'success'
  //   resultPrint.data = data || {}

  //   res.status(resultPrint.status).json(resultPrint)
  // }
}
