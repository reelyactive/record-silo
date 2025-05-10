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
 * StoreManager Class
 * Manages the storage and retrieval of records.
 */
class StoreManager {

  /**
   * StoreManager constructor
   * @param {Object} options The options as a JSON object.
   * @constructor
   */
  constructor(options) {
    let self = this;
    options = options || {};

    fs.mkdir(DEFAULT_RECORDS_FOLDER, { recursive: true }, (err) => {
      if(err) {
        console.log('record-silo could not create/access records directory:',
                    DEFAULT_RECORDS_FOLDER, ' Record store will not function.');
      }
    });
  }

  /**
   * Store a new record file
   * @param {Object} req The HTTP request.
   * @param {Object} res The HTTP result.
   * @param {callback} callback Function to call on completion.
   */
  create(req, res, callback) {
    let self = this;

    if(req.file === undefined) {
      return callback(HTTP_STATUS_UNSUPPORTED_MEDIA_TYPE);
    }
    else if(!isValidDeviceId(req.body.deviceId)) {
      return callback(HTTP_STATUS_BAD_REQUEST);
    }
    else {
      let fileName = req.body.deviceId.toLowerCase() + '-' +
                     createCurrentTimeString() +  '-' +
                     req.file.originalname;
      let filePath = path.resolve(DEFAULT_RECORDS_FOLDER + '/' + fileName);

      fs.writeFile(filePath, req.file.buffer, (err) => {
        if(err) {
          return callback(HTTP_STATUS_INTERNAL_SERVER_ERROR);
        }
        else {
          let records = { fileName: fileName };
          return callback(HTTP_STATUS_CREATED, { records: records });
        }
      });
    }
  }

  /**
   * Retrieve an existing record file
   * @param {String} fileName The filename of the record.
   * @param {callback} callback Function to call on completion.
   */
  retrieve(fileName, callback) {
    let filePath = path.resolve(DEFAULT_RECORDS_FOLDER + '/' + fileName);

    fs.access(filePath, fs.F_OK, (err) => {
      if(err) {
        return callback(HTTP_STATUS_NOT_FOUND);
      }
      return callback(HTTP_STATUS_OK, filePath);
    });
  }

}


/**
 * Determine whether the given deviceId is a hexadecimal string.
 * @return {boolean} The validity of the deviceId.
 */
function isValidDeviceId(deviceId) {
  if(typeof deviceId === 'string') {
    return /^[0-9a-fA-F]+$/.test(deviceId);
  }

  return false;
}


/**
 * Return a time/date string in the form YYMMDD-HHMMSS
 * @return {String} The thirteen-digit string.
 */
function createCurrentTimeString() {
  let date = new Date();
  let timestring = date.getFullYear().toString().slice(-2);
  timestring += ('0' + (date.getMonth() + 1)).slice(-2);
  timestring += ('0' + date.getDate()).slice(-2);
  timestring += '-';
  timestring += ('0' + date.getHours()).slice(-2);
  timestring += ('0' + date.getMinutes()).slice(-2);
  timestring += ('0' + date.getSeconds()).slice(-2);

  return timestring;
}


module.exports = StoreManager;
