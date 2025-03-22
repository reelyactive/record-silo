/**
 * Copyright reelyActive 2025
 * We believe in an open Internet of Things
 */


const express = require('express');
const multer = require('multer');
const path = require('path');
const responseHandler = require('./responsehandler');


const SUPPORTED_RECORD_FILE_TYPES = /jpeg|jpg|png|gif/;
const RECORD_FILE_NAME = 'record';


let router = express.Router();
let upload = multer({ fileFilter: fileFilter });


router.route('/records')
  .post(upload.single(RECORD_FILE_NAME), (req, res) => {
    createRecord(req, res);
  });

router.route('/records/:id')
  .get((req, res) => {
    retrieveRecord(req, res);
  });


/**
 * Create the given record.
 * @param {Object} req The HTTP request.
 * @param {Object} res The HTTP result.
 */
function createRecord(req, res) {
  let records = req.recordsilo.records;

  records.create(req, res, (status, data) => {
    let response = responseHandler.prepareResponse(req, status, data);
    res.status(status).json(response);
  });
}


/**
 * Retrieve the given record.
 * @param {Object} req The HTTP request.
 * @param {Object} res The HTTP result.
 */
function retrieveRecord(req, res) {
  let records = req.recordsilo.records;
  let recordFileName = req.params.id;

  records.retrieve(recordFileName, (status, data) => {
    if(data) {
      res.sendFile(data);
    }
    else {
      res.status(status).send();
    }
  });
}


/**
 * Reject record files with incompatible mimetype and/or extname.
 * @param {Object} req The HTTP request.
 * @param {Object} file The multipart file.
 * @param {function} callback Function to call on completion.
 */
function fileFilter(req, file, callback) {
  let isValidExtname = SUPPORTED_RECORD_FILE_TYPES
                        .test(path.extname(file.originalname)
                        .toLowerCase());
  let isValidMimetype = SUPPORTED_RECORD_FILE_TYPES.test(file.mimetype); 
    
  if(isValidMimetype && isValidExtname) {
    return callback(null, true);
  }
  else {
    return callback(null, false);
  }
}


module.exports = router;
