const multer = require('multer');

// Storage setup to keep files in memory
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Accept images and MP4 video files only
  if (file.mimetype.startsWith('image') || file.mimetype === 'video/mp4') {
    cb(null, true);
  } else {
    cb(new Error('Not a valid file type'), false);
  }
};

const limits = {
  fileSize: 1024 * 1024 * 5 // 5MB size limit
};

const upload = multer({ storage, fileFilter, limits });

module.exports = {
  upload: upload.fields([
    { name: 'images', maxCount: 2 },
    { name: 'video', maxCount: 1 }
  ])
};
