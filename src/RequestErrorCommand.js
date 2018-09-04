class RequestErrorCommand {

    constructor(errorQueue, request){
        this._errorQueue = errorQueue;
        this._request = request;
    }

    execute(){
        'use strict';

        if(this._errorQueue.getCount() === 0)
            return;

        const error = this._errorQueue.dequeue();
        this._request.emit('error', error);
    }
}
module.exports = RequestErrorCommand;