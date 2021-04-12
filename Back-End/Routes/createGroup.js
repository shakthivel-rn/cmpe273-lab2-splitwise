/* eslint-disable no-underscore-dangle */
const express = require('express');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
const path = require('path');
const Users = require('../ModelsMongoDB/Users');
const Groups = require('../ModelsMongoDB/Groups');
const { checkAuth } = require('../Utils/passport');
const kafka = require('../kafka/client');

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

router.post('/', checkAuth, async (req, res) => {
  console.log('Inside Create Group POST!');
  console.log('Request Body: ', req.body);
  kafka.make_request('create-group', req.body, (err, result) => {
    if (result === 400) {
      res.status(400);
    } else {
      res.status(200);
    }
    console.log(result);
    res.send();
  });
});

router.get('/getMemberEmails', checkAuth, async (req, res) => {
  const memberEmails = await Users.find({}, { email: 1 });
  res.send(memberEmails);
});

router.post('/profile-img-upload', (req, res) => {
  profileImgUpload(req, res, (error) => {
    if (error) {
      console.log('errors', error);
      res.json({ error });
    } else if (req.file === undefined) {
      console.log('Error: No File Selected!');
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
  const group = await Groups.findOne({ name: req.body.groupName });
  group.image = req.body.fileLocation;
  group.save();
  res.sendStatus(200);
});

module.exports = router;
