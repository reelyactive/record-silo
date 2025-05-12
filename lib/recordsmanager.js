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

    fs.mkdir(DEFAULT_RECORDS_FOLDER, { recursive: true }, (err) => {
      if(err) {
        console.log('record-silo could not create/access records directory:',
                    DEFAULT_RECORDS_FOLDER, ' Record store will not function.');
      }
    });
  }

  /**
   * Store a new record file
   * @param {Object} file The record file.
   * @param {String} id The device identifier.
   * @param {Number} type The device identifier type.
   * @param {callback} callback Function to call on completion.
   */
  create(file, id, type, callback) {
    let self = this;

    if(file === undefined) {
      return callback(HTTP_STATUS_UNSUPPORTED_MEDIA_TYPE);
    }
    else if(!isValidDeviceId(id)) {
      return callback(HTTP_STATUS_BAD_REQUEST);
    }
    else {
      type = type || 0;
      let timestamp = Date.now();
      let filename = id.toLowerCase() + '-' + type + '-' +
                     createTimeString(timestamp) +  '-' +
                     file.originalname;
      let filePath = path.resolve(DEFAULT_RECORDS_FOLDER + '/' + filename);

      fs.writeFile(filePath, file.buffer, (err) => {
        if(err) {
          return callback(HTTP_STATUS_INTERNAL_SERVER_ERROR);
        }
        else {
          let records = {};
          records[filename] = { timestamp: timestamp };
          return callback(HTTP_STATUS_CREATED, { records: records });
        }
      });
    }
  }

  /**
   * Retrieve records for one or all devices
   * @param {String} filename The optional record file name.
   * @param {String} id The optional device identifier.
   * @param {Number} type The optional device identifier type.
   * @param {callback} callback Function to call on completion.
   */
  retrieve(filename, id, type, callback) {
    let directoryPath = path.resolve(DEFAULT_RECORDS_FOLDER);

    // Retrieve a specific file
    if(filename) {
      let filePath = path.resolve(DEFAULT_RECORDS_FOLDER + '/' + filename);

      fs.access(filePath, fs.F_OK, (err) => {
        if(err) {
          return callback(HTTP_STATUS_NOT_FOUND);
        }
        return callback(HTTP_STATUS_OK, filePath);
      });
    }

    // Retrieve device records
    else {
      fs.readdir(directoryPath, (err, files) => {
        if(err) {
          return callback(HTTP_STATUS_INTERNAL_SERVER_ERROR);
        }
        else {
          let devices = {};
          files.forEach((file) => {
            let fileElements = file.split('-');
            let isValidRecordFile = (fileElements.length >= 5);

            if(isValidRecordFile) {
              let deviceSignature = fileElements[0] + '/' + fileElements[1];

              // Filter records by device id/type
              if(id) {
                let prefix = id;
                if(type) {
                  prefix += '-' + type;
                }
                if(file.startsWith(prefix)) {
                  if(!Array.isArray(devices[deviceSignature])) {
                    devices[deviceSignature] = [];
                  }
                  devices[deviceSignature].push(file);
                }
              }
              // Include all records
              else {
                if(!Array.isArray(devices[deviceSignature])) {
                  devices[deviceSignature] = [];
                }
                devices[deviceSignature].push(file);
              }
            }
          });

          // TODO: sort arrays by timestamp?
          return callback(HTTP_STATUS_OK, { devices: devices });
        }
      });
    }
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
 * @param {Number} timestamp The timestamp.
 * @return {String} The thirteen-digit string.
 */
function createTimeString(timestamp) {
  let date = new Date(timestamp);
  let timestring = date.getFullYear().toString().slice(-2);
  timestring += ('0' + (date.getMonth() + 1)).slice(-2);
  timestring += ('0' + date.getDate()).slice(-2);
  timestring += '-';
  timestring += ('0' + date.getHours()).slice(-2);
  timestring += ('0' + date.getMinutes()).slice(-2);
  timestring += ('0' + date.getSeconds()).slice(-2);

  return timestring;
}


module.exports = RecordsManager;
