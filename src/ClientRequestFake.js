const EventEmitter = require('events');

class ClientRequestFake extends EventEmitter {

  constructor(queues) {
    super();
    this._queues = queues;
  }

  end() {
    this.tryToEnqueueResponseCallback();

    this.emit('end');
  }

  write(data) {
    this.emit('write', data);
  }

  tryToEnqueueResponseCallback() {
    if(typeof this._events.response !== 'function')
      return;

    this._queues.callbacks.enqueue(this._events.response);
  }
}

module.exports = ClientRequestFake;