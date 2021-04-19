const express = require('express');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
const path = require('path');
const kafka = require('../kafka/client');
const { checkAuth } = require('../Utils/passport');

const router = express.Router();

const s3 = new aws.S3({
  accessKeyId: 'AKIAJDLWO33APP5O5NSQ',
  secretAccessKey: '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',
  Bucket: 'lab-splitwise-imageupload',
});

function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  }
  return cb('Error: Images Only!');
}

const profileImgUpload = multer({
  storage: multerS3({
    s3,
    bucket: 'lab-splitwise-imageupload',
    acl: 'public-read',
    key(req, file, cb) {
      cb(null, `${path.basename(file.originalname, path.extname(file.originalname))}-${Date.now()}${path.extname(file.originalname)}`);
    },
  }),
  limits: { fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
}).single('profileImage');

router.get('/getUserDetails', checkAuth, async (req, res) => {
  kafka.make_request('get-user-details', req.query, (err, result) => {
    res.send(result);
  });
});

router.put('/editName', checkAuth, async (req, res) => {
  kafka.make_request('edit-name', req.body, (err, result) => {
    res.sendStatus(result);
  });
});

router.put('/editEmail', checkAuth, async (req, res) => {
  kafka.make_request('edit-email', req.body, (err, result) => {
    res.sendStatus(result);
  });
});

router.put('/editPhoneNumber', checkAuth, async (req, res) => {
  kafka.make_request('edit-phonenumber', req.body, (err, result) => {
    res.sendStatus(result);
  });
});

router.put('/editDefaultCurrency', checkAuth, async (req, res) => {
  kafka.make_request('edit-defaultcurrency', req.body, (err, result) => {
    res.sendStatus(result);
  });
});

router.put('/editTimeZone', checkAuth, async (req, res) => {
  kafka.make_request('edit-timezone', req.body, (err, result) => {
    res.sendStatus(result);
  });
});

router.put('/editLanguage', checkAuth, async (req, res) => {
  kafka.make_request('edit-language', req.body, (err, result) => {
    res.sendStatus(result);
  });
});

router.post('/profile-img-upload', (req, res) => {
  profileImgUpload(req, res, (error) => {
    if (error) {
      res.json({ error });
    } else if (req.file === undefined) {
      res.json('Error: No File Selected');
    } else {
      // If Success
      const imageName = req.file.key;
      const imageLocation = req.file.location;
      // Save the file name into database into profile model
      res.json({
        image: imageName,
        location: imageLocation,
      });
    }
  });
});

router.post('/storeImage', async (req, res) => {
  kafka.make_request('store-user-image', req.body, (err, result) => {
    res.sendStatus(result);
  });
});

router.get('/getImage', async (req, res) => {
  kafka.make_request('get-user-image', req.query, (err, result) => {
    res.send(result);
  });
});

module.exports = router;
