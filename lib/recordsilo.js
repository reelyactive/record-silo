/**
 * Copyright reelyActive 2025
 * We believe in an open Internet of Things
 */


const express = require('express');
const path = require('path');
const RecordsManager = require('./recordsmanager');


/**
 * RecordSilo Class
 * Data silo for digital records in context-aware physical spaces.
 */
class RecordSilo {

  /**
   * RecordSilo constructor
   * @param {Object} options The configuration options.
   * @constructor
   */
  constructor(options) {
    let self = this;
    options = options || {};

    if(options.app) {
      configureExpress(options.app, self);
    }

    this.records = new RecordsManager(options);

    console.log('reelyActive record-silo instance is hosting digital records in an open IoT');
  }

}


/**
 * Configure the routes of the API.
 * @param {Express} app The Express app.
 * @param {RecordSilo} instance The Record Silo instance.
 */
function configureExpress(app, instance) {
  app.use(function(req, res, next) {
    req.recordsilo = instance;
    next();
  });
  app.use('/store', require('./routes/store'));
  app.use('/', express.static(path.resolve(__dirname + '/../web')));
}


module.exports = RecordSilo;
