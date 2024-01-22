// Multer File upload settings
import multer from "multer";
const DIR = './public/';
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, DIR);
  },
  filename: (req, file, callback) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    callback(null, fileName)
  }
});
var upload = multer({
  storage: storage,
  // limits: {
  //   fileSize: 1024 * 1024 * 5
  // },
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

export default upload;