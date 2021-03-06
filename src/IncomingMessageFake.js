const EventEmitter = require('events');

class IncomingMessageFake extends EventEmitter {

  constructor(content = {}) {
    super();
    this._content = content;
  }

  get headers() {
    return this._content.headers;
  }

  get statusCode() {
    return this._content.statusCode;
  }

  get statusMessage() {
    return this._content.statusMessage;
  }

  setEncoding() {}
}

module.exports = IncomingMessageFake