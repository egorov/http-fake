const IncomingMessage = require('./IncomingMessageFake'),
  split = require('./SplitStringToChunks');

class ResponseSendCommand {

  constructor(queues) {
    this._queues = queues;
  }

  execute() {
    'use strict';

    if (this._isErrorProcessingRequired())
      return;

    const callback = this._queues.callbacks.dequeue();
    const response = this._queues.responsesExpected.dequeue();
    const message = new IncomingMessage(response);
    
    callback(message);

    if (typeof response.body === 'undefined') {
      message.emit('end');
      return;
    }

    let data = response.body;

    if(typeof data !== 'string')
      data = JSON.stringify(response.body);
      
    const chunks = split(data, 10);

    for (let i = 0; i < chunks.length; i++) {
      message.emit('data', chunks[i]);
    }

    message.emit('end');
  }

  _isErrorProcessingRequired() {
    'use strict';

    if (this._queues.responseErrors.getCount() > 0)
      return true;

    if (this._queues.requestErrors.getCount() > 0)
      return true;

    return false;
  }
}
module.exports = ResponseSendCommand;