const multer = require('multer')
const uuidv1 = require('uuid/v1')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images')
  },
  filename: (req, file, cb) => {
    let filetype = ''
    if (file.mimetype === 'image/gif') {
      filetype = 'gif'
    }
    if (file.mimetype === 'image/png') {
      filetype = 'png'
    }
    if (file.mimetype === 'image/jpeg') {
      filetype = 'jpg'
    }
    cb(null, 'image-' + uuidv1() + '.' + filetype)
  }
})

module.exports = {
  upload: multer({
    storage: storage
  })
}
