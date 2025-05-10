/**
 * Copyright reelyActive 2025
 * We believe in an open Internet of Things
 */


const fs = require('fs');
const path = require('path');


const DEFAULT_RECORDS_FOLDER = 'data/records';
const HTTP_STATUS_OK = 200;
const HTTP_STATUS_CREATED = 201;
const HTTP_STATUS_BAD_REQUEST = 400;
const HTTP_STATUS_NOT_FOUND = 404;
const HTTP_STATUS_UNSUPPORTED_MEDIA_TYPE = 415;
const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;


/**
 * RecordsManager Class
 * Manages the retrieval of records.
 */
class RecordsManager {

  /**
   * RecordsManager constructor
   * @param {Object} options The options as a JSON object.
   * @constructor
   */
  constructor(options) {
    let self = this;
    options = options || {};
  }

  /**
   * Retrieve records for one or all devices
   * @param {String} id The optional device identifier.
   * @param {callback} callback Function to call on completion.
   */
  retrieve(id, callback) {
    let directoryPath = path.resolve(DEFAULT_RECORDS_FOLDER);

    fs.readdir(directoryPath, (err, files) => {
      if(err) {
        return callback(HTTP_STATUS_INTERNAL_SERVER_ERROR);
      }
      else {
        let devices = {};
        files.forEach((file) => {
          // Filter records by device id
          if(id) {
            if(file.startsWith(id)) {
              if(!Array.isArray(devices[id])) {
                devices[id] = [];
              }
              devices[id].push(file);
            }
          }
          // Include all records
          else {
            let fileElements = file.split('-');
            let isValidRecordFile = (fileElements.length >= 3);

            if(isValidRecordFile) {
              id = fileElements[0];
              if(!Array.isArray(devices[id])) {
                devices[id] = [];
              }
              devices[id].push(file);
            }
          }
        });
        // TODO: sort arrays by timestamp?
        return callback(HTTP_STATUS_OK, { devices: devices });
      }
    });
  }

}


module.exports = RecordsManager;
