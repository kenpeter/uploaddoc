const cors = require('cors');
const express = require('express');
const multer = require('multer');

// in func, then return the sercer
function build() {
  // create server
  const server = express();

  // HAS to before route
  server.use(cors());

  // doc upload
  server.post('/api/1.0/docUpload', (req, res) => {
    // storage
    const storage = multer.diskStorage({
      // where
      destination: (req, file, cb) => {
        cb(null, 'public');
      },
      // filename
      filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
      }
    });

    // multi
    const upload = multer({storage: storage}).array('file');

    // up, req, res
    upload(req, res, err => {
      if (err instanceof multer.MulterError) {
        console.log('multer err');
        return res.status(500).json(err);
      } else if (err) {
        console.log('normal err', err);
        return res.status(500).json(err);
      }

      // send file
      console.log('last?');
      return res.status(200).json({status: 'done'});
    });
  });

  // return server
  return server;
}

module.exports = build;
