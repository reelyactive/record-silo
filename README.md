record-silo
===========

Data silo for digital records in context-aware physical spaces.


Quick Start
-----------

Clone this repo then install dependencies with:

    npm install

Run the record-silo with:

    npm start

POST a record (.jpg/.jpeg/.png/.gif) to http://localhost:3001/records/device/4ec04d7e57e4/2 as detailed in the REST API section below.


REST API
--------

The __record-silo__'s REST API includes the following base route:
- /records _for storing and retrieving record files_

### GET /records

Retrieve a list of all records.

#### Example request

| Method | Route    | Content-Type     |
|:-------|:---------|:-----------------|
| GET    | /records | application/json |

#### Example response

    {
      "_meta": {
        "message": "ok",
        "statusCode": 200
      },
      "_links": {
        "self": {
          "href": "http://localhost:3001/records"
        }
      },
      "records": {
        "250512-123456-device-4ec04d7e57e4-2-image.jpg": {},
        "250512-223344-device-4ec04d7e57e4-2-image.jpg": {}
      }
    }


### GET /records/{filename}

Retrieve a record with the given _filename_.

#### Example request

| Method | Route                                           | Content-Type     |
|:-------|:------------------------------------------------|:-----------------|
| GET    | /records/250512-123456-device-4ec04d7e57e4-2-image.jpg | application/json |

#### Example response

If it exists, the file is returned.  Else a 404 Not Found error is returned.


### GET /records/device/{id}/{type}

Retrieve a list of records associated with the given device _id_ and _type_.

#### Example request

| Method | Route                          | Content-Type     |
|:-------|:-------------------------------|:-----------------|
| GET    | /records/device/4ec04d7e57e4/2 | application/json |

#### Example response

    {
      "_meta": {
        "message": "ok",
        "statusCode": 200
      },
      "_links": {
        "self": {
          "href": "http://localhost:3001/records/device/4ec04d7e57e4/2"
        }
      },
      "records": {
        "250512-123456-device-4ec04d7e57e4-2-image.jpg": {
          "device": "4ec04d7e57e4/2"
        },
        "250512-223344-device-4ec04d7e57e4-2-image.jpg": {
          "device": "4ec04d7e57e4/2"
        }
      }
    }

### POST /records/device/{id}/{type}

Create a record associated with the given device _id_ and _type_.  The file name of the record is provided in the response.

#### Example request

| Method | Route                          | Content-Type        |
|:-------|:-------------------------------|:--------------------|
| POST   | /records/device/4ec04d7e57e4/2 | multipart/form-data |

The form-data must contain a record as follows:

| Key      | Value        | Example      |
|:---------|:-------------|:-------------|
| record   | (file)       | image.jpg    |

The following Postman screenshot details a valid request:

![Postman POST /records](https://reelyactive.github.io/record-silo/images/postman-post-records.png)

#### Example response

    {
      "_meta": {
        "message": "created",
        "statusCode": 201
      },
      "_links": {
        "self": {
          "href": "http://localhost:3001/records/device/4ec04d7e57e4/2"
        }
      },
      "records": {
        "250512-123456-device-4ec04d7e57e4-2-image.jpg": {
          "device": "4ec04d7e57e4/2",
          "timestamp": 1747085146380
        }
      }
    }


Contributing
------------

Discover [how to contribute](CONTRIBUTING.md) to this open source project which upholds a standard [code of conduct](CODE_OF_CONDUCT.md).


Security
--------

Consult our [security policy](SECURITY.md) for best practices using this open source software and to report vulnerabilities.


License
-------

MIT License

Copyright (c) 2025 [reelyActive](https://www.reelyactive.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
THE SOFTWARE.