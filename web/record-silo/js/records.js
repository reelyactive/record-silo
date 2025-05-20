/**
 * Copyright reelyActive 2025
 * We believe in an open Internet of Things
 */


// Constants
const STATUS_OK = 200;
const STATUS_CREATED = 201;
const STATUS_BAD_REQUEST = 400;
const STATUS_NOT_FOUND = 404;
const MESSAGE_BAD_REQUEST = 'Bad Request [400].  An error likely occurred on the server.';
const MESSAGE_NOT_FOUND = 'Record(s) Not Found [404].';
const RECORDS_ROUTE = '/records';


// DOM elements
let returnButton = document.querySelector('#returnbutton');
let records = document.querySelector('#records');
let jsonResponse = document.querySelector('#jsonResponse');
let loading = document.querySelector('#loading');
let error = document.querySelector('#error');
let errorMessage = document.querySelector('#errorMessage');


// Other variables
let queryUrl = window.location.href;
let recordsUrl = window.location.protocol + '//' + window.location.hostname +
                 ':' + window.location.port + RECORDS_ROUTE;
let isRootQuery = false;


// Hide "return to /records" button when already querying /records
if((window.location.pathname.endsWith(RECORDS_ROUTE )) ||
   (window.location.pathname.endsWith(RECORDS_ROUTE + '/'))) {
  isRootQuery = true;
  returnButton.hidden = true;
}


// Initialisation: GET the records and display in DOM
getRecords(queryUrl, (status, response) => {
  jsonResponse.textContent = JSON.stringify(response, null, 2);
  loading.hidden = true;

  if(status === STATUS_OK) {
    updateRecords(response.records);
    records.hidden = false;
  }
  else if(status === STATUS_BAD_REQUEST) {
    errorMessage.textContent = MESSAGE_BAD_REQUEST;
    error.hidden = false;
  }
  else if(status === STATUS_NOT_FOUND) {
    errorMessage.textContent = MESSAGE_NOT_FOUND;
    error.hidden = false;
  }
});


// GET the records
function getRecords(url, callback) {
  let httpRequest = new XMLHttpRequest();

  httpRequest.onreadystatechange = () => {
    if(httpRequest.readyState === XMLHttpRequest.DONE) {
      return callback(httpRequest.status,
                      JSON.parse(httpRequest.responseText));
    }
  };
  httpRequest.open('GET', url);
  httpRequest.setRequestHeader('Accept', 'application/json');
  httpRequest.send();
}


// Update the records in the DOM
function updateRecords(recordsList) {
  let content = new DocumentFragment();

  for(const id in recordsList) {
    let record = recordsList[id];
    let recordCard = createRecordCard(id, record);
    content.appendChild(recordCard);
  }

  records.replaceChildren(content);
}


// Create the record card visualisation
function createRecordCard(id, record) {
  let isEmptyRecord = (Object.keys(record).length === 0);
  let recordUrl = recordsUrl + '/' + id;
  let headerIcon = createElement('i', 'fas fa-barcode');
  let headerText = createElement('span', 'font-monospace', ' ' + id);
  let header = createElement('div', 'card-header bg-dark text-white lead',
                             [ headerIcon, headerText ]);
  let body = createElement('div', 'card-body');
  let footerIcon = createElement('i', 'fas fa-link text-body-secondary');
  let footerText = createElement('a', 'text-truncate', recordUrl);
  let footer = createElement('small', 'card-footer',
                             [ footerIcon, ' ', footerText ]);
  let card = createElement('div', 'card mb-1', header);

  footerText.setAttribute('href', recordUrl);

  if(!isEmptyRecord) { // TODO: display JSON properties more elegantly
    let recordString = JSON.stringify(record, null, 2);
    let recordProperties = createElement('pre', null, recordString);
    body.appendChild(recordProperties);
    card.appendChild(body);
  }

  card.appendChild(footer);

  return card;
}


// Create an element as specified
function createElement(elementName, classNames, content) {
  let element = document.createElement(elementName);

  if(classNames) {
    element.setAttribute('class', classNames);
  }

  if((content instanceof Element) || (content instanceof DocumentFragment)) {
    element.appendChild(content);
  }
  else if(Array.isArray(content)) {
    content.forEach(function(item) {
      if((item instanceof Element) || (item instanceof DocumentFragment)) {
        element.appendChild(item);
      }
      else {
        element.appendChild(document.createTextNode(item));
      }
    });
  }
  else if(content) {
    element.appendChild(document.createTextNode(content));
  }

  return element;
}