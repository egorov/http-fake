const ClientRequestFake = require('./ClientRequestFake');
const IncomingMessage = require('./IncomingMessageFake');
const split = require('./SplitStringToChunks');
const Queue = require('fixed-size-queue');
const assert = require('assert');

class HttpFake {

    constructor(){
        this._expectedOptions = Queue.create(1000);
        this._actualOptions = Queue.create(1000);
        this._expectedBodies = Queue.create(1000);
        this._expectedErrors = Queue.create(1000);
        this._willReturn = Queue.create(1000);
        this._callbacks = Queue.create(1000);
    }

    expect(request){
        'use strict';
        if((typeof request.body) !== 'undefined'){
            const body = request.body;
            this._expectedBodies.enqueue(body);
        }
        this._expectedOptions.enqueue(request);
    }

    get expecting(){
        'use strict';
        return this._expectedOptions;
    }

    returns(response){
        'use strict';
        this._willReturn.enqueue(response);
    }

    get willReturn(){
        'use strict';
        return this._willReturn;
    }

    shouldEmit(error){
        this._expectedErrors.enqueue(error);
    }

    request(options, callback){
        'use strict';

        this._validateOptions(options);
        this._validateCallback(callback);

        const requestFake = new ClientRequestFake();

        this._actualOptions.enqueue(options);
        this._callbacks.enqueue(callback);

        const requestHandler = this._handleWithRequest.bind(this);
        requestFake.on('end', requestHandler);

        const bodyCheckHandler = this._checkRequestBody.bind(this);
        requestFake.on('write', bodyCheckHandler);

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

    _handleWithRequest(){
        'use strict';

        this._tryToImitateRequestHandling();
        this._tryToImitateResponseError();
        this._checkRequestOptions();
    }

    _tryToImitateRequestHandling(){
        'use strict';

        if(this._expectedErrors.getCount() > 0)
            return;

        const callback = this._callbacks.dequeue();
        const response = this._willReturn.dequeue();
        const message = new IncomingMessage(response);

        callback(message);

        const data = JSON.stringify(response.body);
        const chunks = split(data, 10);

        for(let i = 0; i < chunks.length; i++){
            message.emit('data', chunks[i]);
        }

        message.emit('end');
    }

    _tryToImitateResponseError(){
        'use strict';

        if(this._expectedErrors.getCount() == 0)
            return;

        const callback = this._callbacks.dequeue();
        const error = this._expectedErrors.dequeue();
        const message = new IncomingMessage();
        callback(message);
        message.emit('error', error);
    }

    _checkRequestOptions(){
        const expect = this._expectedOptions.dequeue();
        const actual = this._actualOptions.dequeue();

        for(let name in expect){

            if(name === 'body')
                continue;

            let msg =   'Expected options.' + name +
                        ' == ' + expect[name] +
                        ', actual is ' + actual[name] + '!';
            assert.deepEqual(expect[name], actual[name], msg);
        }
    }

    _checkRequestBody(actual){
        'use strict';

        const body = this._expectedBodies.dequeue();
        const expected = JSON.stringify(body);
        const msg = `Expected body content ${expected}, but actual content is ${actual}`;
        assert.equal(expected, actual, msg);
    }
}

module.exports = HttpFake;