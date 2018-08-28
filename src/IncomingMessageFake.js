const EventEmitter = require('events');

class IncomingMessageFake extends EventEmitter {

    constructor(headers = {}){
        super();
        this._headers = headers;
    }

    get headers(){
        return this._headers;
    }
}

module.exports = IncomingMessageFake