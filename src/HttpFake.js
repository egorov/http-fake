const ClientRequestFake = require('./ClientRequestFake'),
  ResponseSendCommand = require('./ResponseSendCommand'),
  ResponseErrorCommand = require('./ResponseErrorCommand'),
  RequestErrorCommand = require('./RequestErrorCommand'),
  OptionsMatchCommand = require('./RequestOptionsMatchCommand'),
  RequestBodyMatchHandler = require('./RequestBodyMatchHandler'),
  RequestUrlMatchCheck = require('./RequestUrlCheckCommand'),
  ExpressResponseFake = require('./ExpressResponseFake'),
  Storage = require('./Queues');

class HttpFake {

  constructor() {

    this._queues = new Storage();

    this._responseSendCommand = new ResponseSendCommand(this._queues);

    this._responseErrorCommand = new ResponseErrorCommand(
      this._queues.responseErrors,
      this._queues.callbacks);

    this._urlCheck = new RequestUrlMatchCheck(
      this._queues.urlsExpected,
      this._queues.urlsActual);

    this._optionsMatchCommand = new OptionsMatchCommand(
      this._queues.optionsExpected,
      this._queues.optionsActual);

    this._bodyMatchHandler = new RequestBodyMatchHandler(
      this._queues.bodiesExpected);
      
    this._request = new ClientRequestFake(this._queues);

    this._requestErrorCommand = new RequestErrorCommand(
      this._queues.requestErrors,
      this._request
    );
  }

  expect(url, request) {
    'use strict';

    if(typeof url === 'string')
      this._queues.urlsExpected.enqueue(url);
    
    if(typeof url === 'object') {
      this._setExpected(url);
      return;
    }

    this._setExpected(request);
  }

  _setExpected(request) {
    'use strict';

    if (typeof request.body !== 'undefined') 
      this._queues.bodiesExpected.enqueue(request.body);

    this._queues.optionsExpected.enqueue(request);
  }

  returns(response) {
    'use strict';

    this._queues.responsesExpected.enqueue(response);
  }

  responseThrow(error) {
    'use strict';

    this._queues.responseErrors.enqueue(error);
  }

  requestThrow(error) {
    'use strict';

    this._queues.requestErrors.enqueue(error);
  }

  request(url, options, callback) {
    'use strict';

    if(typeof url === 'string')
      this._queues.urlsActual.enqueue(url);

    if(typeof url === 'object')
      this._queues.optionsActual.enqueue(url);

    if(typeof options === 'function'){
      this._queues.callbacks.enqueue(options);
      return this._makeRequest();
    }

    if(typeof options === 'object')
      this._queues.optionsActual.enqueue(options);

    if (typeof callback === 'function')
      this._queues.callbacks.enqueue(callback);
    
    return this._makeRequest();
  }

  _makeRequest() {
    'use strict';

    this._request.removeAllListeners('end');
    this._request.removeAllListeners('write');

    const requestHandler = this._handleWithRequest.bind(this);
    this._request.on('end', requestHandler);

    const urlCheck = this._urlCheck.execute.bind(this._urlCheck);
    this._request.on('end', urlCheck);
    
    const bodyCheckHandler =
      this._bodyMatchHandler.handle.bind(this._bodyMatchHandler);
    this._request.on('write', bodyCheckHandler);

    return this._request;
  }

  _handleWithRequest() {
    'use strict';

    this._responseSendCommand.execute();
    this._requestErrorCommand.execute();
    this._responseErrorCommand.execute();
    this._optionsMatchCommand.execute();
  }

  static makeExpressResponseFake() {
    'use strict';

    return new ExpressResponseFake();
  }
}

module.exports = HttpFake;