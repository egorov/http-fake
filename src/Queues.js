const Queue = require('fixed-size-queue');

class Queues {

  constructor() {
    this._urlsExpected = Queue.create(10);
    this._urlsActual = Queue.create(10);
    this._optionsExpected = Queue.create(10);
    this._optionsActual = Queue.create(10);
    this._bodiesExpected = Queue.create(10);
    this._responseErrors = Queue.create(10);
    this._requestErrors = Queue.create(10);
    this._responsesExpected = Queue.create(10);
    this._callbacks = Queue.create(10);
  }

  get urlsExpected() {
    'use strict';
    return this._urlsExpected;
  }

  get urlsActual() {
    'use strict';
    return this._urlsActual;
  }

  get optionsExpected() {
    'use strict';
    return this._optionsExpected;
  }

  get optionsActual() {
    'use strict';
    return this._optionsActual;
  }

  get bodiesExpected() {
    'use strict';
    return this._bodiesExpected;
  }

  get responseErrors() {
    'use strict';
    return this._responseErrors;
  }

  get requestErrors() {
    'use strict';
    return this._requestErrors;
  }

  get responsesExpected() {
    'use strict';
    return this._responsesExpected;
  }

  get callbacks() {
    'use strict';
    return this._callbacks;
  }
}

module.exports = Queues;