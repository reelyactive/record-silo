/**
 * Copyright reelyActive 2025
 * We believe in an open Internet of Things
 */


const express = require('express');
const path = require('path');
const responseHandler = require('./responsehandler');


let router = express.Router();


router.route('/')
  .get((req, res) => {
    retrieveRecords(req, res);
  });

router.route('/device/:id')
  .get((req, res) => {
    retrieveRecords(req, res);
  });


/**
 * Retrieve the records.
 * @param {Object} req The HTTP request.
 * @param {Object} res The HTTP result.
 */
function retrieveRecords(req, res) {
  let records = req.recordsilo.records;
  let id = req.params.id;

  records.retrieve(id, (status, data) => {
    let response = responseHandler.prepareResponse(req, status, data);
    res.status(status).json(response); 
  });
}


module.exports = router;
