/**
 * Copyright reelyActive 2025
 * We believe in an open Internet of Things
 */


const fs = require('fs');
const path = require('path');


const DEFAULT_RECORDS_FOLDER = 'data/records';
const HTTP_STATUS_OK = 200;
const HTTP_STATUS_CREATED = 201;
const HTTP_STATUS_NOT_FOUND = 404;
const HTTP_STATUS_UNSUPPORTED_MEDIA_TYPE = 415;
const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;


/**
 * RecordsManager Class
 * Manages the storage and retrieval of records.
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
   * Create a new record
   * @param {Object} req The HTTP request.
   * @param {Object} res The HTTP result.
   * @param {callback} callback Function to call on completion.
   */
  create(req, res, callback) {
    let self = this;

    if(req.file === undefined) {
      return callback(HTTP_STATUS_UNSUPPORTED_MEDIA_TYPE);
    }
    else {
      // TODO: add deviceSignature and timestamp to file name
      let fileName = req.file.originalname;
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
   * Retrieve an existing image
   * @param {String} fileName The filename of the image.
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


module.exports = RecordsManager;
