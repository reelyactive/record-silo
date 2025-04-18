record-silo
===========

Data silo for digital records in context-aware physical spaces.


Quick Start
-----------

Clone this repo then install dependencies with:

    npm install

Run the record-silo with:

    npm start

POST a record (.jpg/.jpeg/.png/.gif) to http://localhost:3001/store/records/ as detailed in the REST API section below.


REST API
--------

The __record-silo__'s REST API includes the following base route:
- /records _for storing and retrieving record files_

### POST /records

Create a record.  The _fileName_ of the record is provided in the response.

#### Example request

| Method | Route    | Content-Type        |
|:-------|:---------|:--------------------|
| POST   | /records | multipart/form-data |

The form-data must contain both a record and a deviceId, as follows:

| Key      | Value        | Example      |
|:---------|:-------------|:-------------|
| record   | (file)       | image.jpg    |
| deviceId | (hex string) | fee150bada55 |

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
          "href": "http://localhost:3001/store/records/"
        }
      },
      "records": {
        "fileName": "fee150bada55-250418-123456-image.jpg"
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