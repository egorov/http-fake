const IncomingMessage = require('./IncomingMessageFake');

class ResponseErrorCommand {

    constructor(errorQueue, callbackQueue){
        this._errorQueue = errorQueue;
        this._callbackQueue = callbackQueue;
    }

    execute(){
        'use strict';

        if(this._errorQueue.getCount() == 0)
            return;

        const error = this._errorQueue.dequeue();
        const callback = this._callbackQueue.dequeue();
        const message = new IncomingMessage();

        callback(message);
        message.emit('error', error);
    }
}

module.exports = ResponseErrorCommand;