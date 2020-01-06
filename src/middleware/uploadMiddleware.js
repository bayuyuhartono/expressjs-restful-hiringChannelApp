const multer = require('multer')
const uuidv1 = require('uuid/v1')
const storage = multer.diskStorage({
  destination: (request, file, cb) => {
    cb(null, './public/images')
  },
  filename: (request, file, cb) => {
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
    if (file.mimetype === 'image/jpeg') {
      filetype = 'jpg'
    }
    cb(null, 'image-' + uuidv1() + '.' + filetype)
  }
})
const maxSize = 1000 * 1000 * 1

module.exports = {
  upload: multer({
    storage: storage,
    limits: { fileSize: maxSize }
  }).single('logo'),
  uploadShowcase: multer({
    storage: storage,
    limits: { fileSize: maxSize }
  }).single('showcase')
}
