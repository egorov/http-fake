const ClientRequestFake = require('./ClientRequestFake');
const IncomingMessage = require('./IncomingMessageFake');
const Queue = require('fixed-size-queue');
const assert = require('assert');

class HttpFake {

    constructor(){
        this._expecting = Queue.create(1000);
        this._actual = Queue.create(1000);
        this._willReturn = Queue.create(1000);
        this._callbacks = Queue.create(1000);
    }

    expect(request){
        'use strict';
        this._expecting.enqueue(request);
    }

    get expecting(){
        'use strict';
        return this._expecting;
    }

    returns(response){
        'use strict';
        this._willReturn.enqueue(response);
    }

    get willReturn(){
        'use strict';
        return this._willReturn;
    }

    request(options, callback){
        'use strict';

        this._validateOptions(options);
        this._validateCallback(callback);

        const requestFake = new ClientRequestFake();

        this._actual.enqueue(options);
        this._callbacks.enqueue(callback);

        const handler = this.run.bind(this);
        requestFake.on('end', handler);

        return requestFake;
    }

    _validateOptions(options){
        'use strict';

        if((typeof options) !== 'object')
            throw new Error('options should be an object!');
    }

    _validateCallback(callback){
        'use strict';

        if((typeof callback) !== 'function')
            throw new Error('callback is required argument!')
    }

    run(){
        'use strict';

        this._checkRequestOptions();

        const callback = this._callbacks.dequeue();
        const response = this._willReturn.dequeue();
        const message = new IncomingMessage(response);

        callback(message);

        const data = JSON.stringify(response.body);
        message.emit('data', data);
    }

    _checkRequestOptions(){
        const request = this._expecting.dequeue();
        const options = this._actual.dequeue();

        for(let name in request){
            let msg = `Expected options.${name} == ${request[name]}, actual is ${options[name]}!`;
            assert.deepEqual(request[name], options[name], msg);
        }
    }
}

module.exports = HttpFake;