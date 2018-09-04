const Queue = require('fixed-size-queue');

class Queues {

    constructor(){
        this._optionsExpected = Queue.create(10);
        this._optionsActual = Queue.create(10);
        this._bodiesExpected = Queue.create(10);
        this._errorsExpected = Queue.create(10);
        this._responsesExpected = Queue.create(10);
        this._callbacks = Queue.create(10);
    }

    get optionsExpected(){
        'use strict';
        return this._optionsExpected;
    }

    get optionsActual(){
        'use strict';
        return this._optionsActual;
    }

    get bodiesExpected(){
        'use strict';
        return this._bodiesExpected;
    }

    get errorsExpected(){
        'use strict';
        return this._errorsExpected;
    }

    get responsesExpected(){
        'use strict';
        return this._responsesExpected;
    }

    get callbacks(){
        'use strict';
        return this._callbacks;
    }
}

module.exports = Queues;